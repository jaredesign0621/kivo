import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight, FiUserPlus, FiMoreHorizontal, FiPlus, FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import SlashCommandPopover from './SlashCommandPopover';
import DocumentManageModal from './DocumentManageModal';
import IdeaBoard from './IdeaBoard';
import IdeaWrite from './IdeaWrite';
import IdeaDetail from './IdeaDetail';
import JiraPanel from './JiraPanel';
import ConfirmModal from './ConfirmModal';
import { collection, doc, deleteDoc, onSnapshot, query, orderBy, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ConfluencePanel({ isLnbOpen = true, onOpenInviteModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isIdeaExpanded, setIsIdeaExpanded] = useState(true);
  
  const [ideaDocs, setIdeaDocs] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // URL 분석하여 현재 메뉴와 게시판 ID 파악
  const isTodo = location.pathname.includes('/workspace/todo');
  const activeMainMenu = isTodo ? 'todo' : 'idea';
  const pathParts = location.pathname.split('/');
  const boardIdParam = activeMainMenu === 'idea' ? pathParts[3] : null;

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const [deleteIdeaId, setDeleteIdeaId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'ideaDocs'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (docs.length === 0 && import.meta.env.DEV) {
        docs = [
          { id: 1, title: '디자인 시스템' },
          { id: 2, title: '마케팅 아이디어' }
        ];
      }

      setIdeaDocs(docs);
      setIsLoadingDocs(false);
      
      // Select first board if nothing is selected and we are on /workspace/ideas
      if (docs.length > 0 && !isTodo && (!boardIdParam || boardIdParam === 'ideas')) {
        navigate(`/workspace/ideas/${docs[0].id}`, { replace: true });
      }
    });

    return () => unsubscribe();
  }, [boardIdParam, isTodo, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateNew = () => {
    setEditingDoc(null);
    setIsManageModalOpen(true);
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setIsManageModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteBoard = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말 이 게시판을 삭제하시겠습니까? 내부의 모든 게시물도 삭제됩니다.')) {
      try {
        await deleteDoc(doc(db, 'ideaDocs', id));
        if (activeBoardId === id) {
          setActiveBoardId(ideaDocs[0]?.id || null);
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const confirmDeleteIdea = async () => {
    if (!deleteIdeaId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'ideas', deleteIdeaId));
      setActiveView('list');
      setDeleteIdeaId(null);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveModal = async (title) => {
    try {
      if (editingDoc) {
        // Firebase 업데이트 로직
        if (typeof editingDoc.id === 'string') {
          await updateDoc(doc(db, 'ideaDocs', editingDoc.id), {
            title: title
          });
        } else {
          // 로컬 더미 데이터 업데이트 (프론트 단에서만 임시 반영)
          setIdeaDocs(ideaDocs.map(d => d.id === editingDoc.id ? { ...d, title } : d));
        }
      } else {
        // Firebase 추가 로직
        const newDocRef = await addDoc(collection(db, 'ideaDocs'), {
          title: title,
          createdAt: serverTimestamp()
        });
        setActiveBoardId(newDocRef.id);
        if (!isIdeaExpanded) setIsIdeaExpanded(true);
      }
    } catch (error) {
      console.error("Error saving document: ", error);
      alert('저장 중 오류가 발생했습니다.');
    }
    
    setIsManageModalOpen(false);
    setEditingDoc(null);
  };

  return (
    <>
      <div 
        className={`shrink-0 h-full flex flex-col bg-bg-panel transition-all duration-300 ease-in-out overflow-hidden ${
          isLnbOpen ? 'w-64 border-r border-gray-200 opacity-100' : 'w-0 border-none opacity-0'
        }`}
      >
        <nav className="flex-1 overflow-y-auto p-2 w-64">
          <div className="space-y-0.5">
            <div 
              className="group flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => setIsIdeaExpanded(!isIdeaExpanded)}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                {isIdeaExpanded ? (
                  <FiChevronDown className="text-neutral-meta shrink-0" size={14} />
                ) : (
                  <FiChevronRight className="text-neutral-meta shrink-0" size={14} />
                )}
                <span className="text-ui font-medium truncate">아이디어</span>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 transition-opacity items-center gap-1 text-neutral-meta">
                <button 
                  className="p-0.5 hover:text-primary hover:bg-gray-300 rounded"
                  title="새로운 아이디어 게시판 생성"
                  onClick={(e) => { e.stopPropagation(); handleCreateNew(); }}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* 2Depth Items (Idea Boards) */}
            {isIdeaExpanded && (
              <div className="pl-6 mt-0.5 flex flex-col gap-0.5 relative">
                {ideaDocs.map(doc => (
                  <div 
                    key={doc.id} 
                    onClick={() => {
                      navigate(`/workspace/ideas/${doc.id}`);
                    }} 
                    className={`group flex items-center justify-between py-1.5 px-2 rounded-sm cursor-pointer transition-colors relative ${activeMainMenu === 'idea' && boardIdParam === doc.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-200'}`}
                  >
                    <span className={`text-[13px] truncate ${activeMainMenu === 'idea' && boardIdParam === doc.id ? 'text-primary' : 'text-neutral-meta group-hover:text-neutral-main'}`}>
                      {doc.title}
                    </span>
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-meta hover:text-primary hover:bg-gray-300 rounded transition-all shrink-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                      }}
                    >
                      <FiMoreHorizontal size={14} />
                    </button>
                    
                    {/* 우측 팝오버 메뉴 (수정, 삭제) */}
                    {activeMenuId === doc.id && (
                      <div ref={menuRef} className="absolute right-8 top-0 bg-white border border-gray-200 shadow-floating rounded-sm py-1 w-28 z-50 animate-fade-in">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(doc); }}
                          className="w-full text-left px-3 py-1.5 text-[12px] text-neutral-main hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEdit2 size={12} /> 이름 바꾸기
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                          className="w-full text-left px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                          <FiTrash2 size={12} /> 삭제
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* 1Depth: 스크랩 */}
            <div className="group flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <FiChevronRight className="text-neutral-meta shrink-0" size={14} />
                <span className="text-ui font-medium truncate">스크랩</span>
              </div>
            </div>

            {/* 1Depth: 일정 */}
            <div className="group flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <FiChevronRight className="text-neutral-meta shrink-0" size={14} />
                <span className="text-ui font-medium truncate">일정</span>
              </div>
            </div>

            {/* 1Depth: Todo */}
            <div 
              onClick={() => navigate('/workspace/todo')}
              className={`group flex items-center justify-between py-1.5 px-2 rounded-sm cursor-pointer transition-colors ${activeMainMenu === 'todo' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <FiChevronRight className={`${activeMainMenu === 'todo' ? 'text-primary' : 'text-neutral-meta'} shrink-0`} size={14} />
                <span className={`text-[14px] truncate ${activeMainMenu === 'todo' ? 'text-primary' : 'text-neutral-main'}`}>Todo</span>
              </div>
            </div>

            {/* 1Depth: 개인화 */}
            <div className="group flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <FiChevronRight className="text-neutral-meta shrink-0" size={14} />
                <span className="text-ui font-medium truncate">개인화</span>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="p-3 w-64 border-t border-gray-200 shrink-0">
          <button 
            onClick={onOpenInviteModal}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-neutral-main py-2 rounded-sm font-medium transition-colors text-[13px]"
          >
            <FiUserPlus size={16} /> 프로젝트 멤버 초대
          </button>
        </div>
      </div>

      <div className={`w-1 cursor-col-resize hover:bg-primary transition-colors z-10 ${!isLnbOpen && 'hidden'}`} />

      <Routes>
        <Route path="todo" element={
          <div className="flex-1 min-w-0 h-full overflow-hidden bg-bg-panel border-l border-gray-200">
            <JiraPanel />
          </div>
        } />
        
        <Route path="ideas" element={
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-base text-neutral-meta">
            <FiMessageSquare size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-main mb-1">선택된 아이디어 게시판이 없습니다.</h3>
            <p className="text-sm">좌측 메뉴에서 게시판을 선택하거나 새 게시판을 생성해 주세요.</p>
          </div>
        } />

        <Route path="ideas/:boardId" element={<IdeaBoardWrapper ideaDocs={ideaDocs} />} />
        <Route path="ideas/:boardId/write" element={<IdeaWriteWrapper ideaDocs={ideaDocs} />} />
        <Route path="ideas/:boardId/:ideaId" element={<IdeaDetailWrapper />} />
        
        <Route path="*" element={<Navigate to="ideas" replace />} />
      </Routes>

      <DocumentManageModal 
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingDoc}
      />

      {isDeleting && (
        <ConfirmModal 
          title="문서 삭제"
          message="이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제하기"
          cancelText="취소"
          onConfirm={executeDelete}
          onCancel={() => {
            setIsDeleting(false);
            setDeleteIdeaId(null);
          }}
          isDestructive={true}
        />
      )}
    </>
  );
}

function IdeaBoardWrapper({ ideaDocs }) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  return (
    <IdeaBoard 
      boardId={boardId} 
      boardTitle={ideaDocs.find(d => d.id === boardId)?.title}
      onWriteClick={() => navigate(`/workspace/ideas/${boardId}/write`)}
      onIdeaClick={(idea) => navigate(`/workspace/ideas/${boardId}/${idea.id}`, { state: { idea } })}
      onEditIdea={(idea) => navigate(`/workspace/ideas/${boardId}/write`, { state: { initialIdea: idea } })}
    />
  );
}

function IdeaWriteWrapper({ ideaDocs }) {
  const { boardId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialIdea = location.state?.initialIdea || null;
  return (
    <IdeaWrite 
      boardId={boardId}
      boardTitle={ideaDocs.find(d => d.id === boardId)?.title}
      initialIdea={initialIdea}
      onSuccess={() => navigate(`/workspace/ideas/${boardId}`)} 
      onCancel={() => navigate(initialIdea ? `/workspace/ideas/${boardId}/${initialIdea.id}` : `/workspace/ideas/${boardId}`)} 
    />
  );
}

function IdeaDetailWrapper() {
  const { boardId, ideaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(location.state?.idea || null);
  
  useEffect(() => {
    if (!idea) {
      const fetchIdea = async () => {
        const docRef = doc(db, 'ideaDocs', boardId, 'ideas', ideaId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIdea({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate(`/workspace/ideas/${boardId}`);
        }
      };
      fetchIdea();
    }
  }, [boardId, ideaId, idea, navigate]);

  if (!idea) return <div className="p-8 text-neutral-meta flex-1 bg-bg-base">게시글을 불러오는 중입니다...</div>;

  return (
    <IdeaDetail 
      idea={idea} 
      onBack={() => navigate(`/workspace/ideas/${boardId}`)}
      onEdit={() => navigate(`/workspace/ideas/${boardId}/write`, { state: { initialIdea: idea } })}
      onDelete={() => navigate(`/workspace/ideas/${boardId}`)}
    />
  );
}
