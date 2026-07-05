import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FiClock, FiMessageSquare, FiEdit3, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';

export default function IdeaBoard({ boardId, boardTitle, onWriteClick, onIdeaClick, onEditIdea }) {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteIdeaId, setDeleteIdeaId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!boardId) return;
    
    const q = query(
      collection(db, 'ideas'), 
      where('boardId', '==', boardId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(ideasData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching ideas:", error);
      setIsLoading(false);
      
      // Fallback for DEV if DB is empty or fails
      if (import.meta.env.DEV) {
        setIdeas([
          {
            id: '1',
            title: `[${boardTitle}] 임시 기획안`,
            content: '현재 디자인 시스템이 모바일 환경에서 일관성이 부족하여 리뉴얼이 필요합니다...',
            author: 'admin',
            boardId: boardId,
            createdAt: { toDate: () => new Date() }
          }
        ]);
      }
    });

    return () => unsubscribe();
  }, [boardId, boardTitle]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteIdeaId(id);
  };

  const confirmDelete = async () => {
    if (!deleteIdeaId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'ideas', deleteIdeaId));
      setDeleteIdeaId(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg-base p-8 relative">
      <div className="w-full">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-neutral-main mb-2">{boardTitle}</h1>
            <p className="text-neutral-meta text-sm">팀원들과 자유롭게 아이디어를 공유하고 피드백을 주고받으세요.</p>
          </div>
          <button 
            onClick={onWriteClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-700 text-white text-[13px] font-medium rounded-sm transition-colors shadow-sm"
          >
            <FiEdit3 size={15} /> 글쓰기
          </button>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20 text-neutral-meta">불러오는 중...</div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-md border border-gray-100 shadow-sm">
            <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-main mb-1">등록된 게시물이 없습니다.</h3>
            <p className="text-neutral-meta text-sm mb-4">우측 상단의 '글쓰기'를 눌러 첫 번째 글을 남겨보세요!</p>
            <button 
              onClick={onWriteClick}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-neutral-main font-medium text-[13px] rounded-sm transition-colors"
            >
              새 글 작성하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {ideas.map(idea => (
              <div 
                key={idea.id} 
                onClick={() => onIdeaClick && onIdeaClick(idea)}
                className="bg-white rounded-md border border-gray-200 p-6 shadow-sm hover:shadow-floating transition-shadow cursor-pointer group flex flex-col relative"
              >
                {/* Hover Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-sm shadow-sm border border-gray-100 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditIdea && onEditIdea(idea); }}
                    className="p-1.5 text-neutral-meta hover:text-primary hover:bg-gray-100 rounded transition-colors"
                    title="수정"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, idea.id)}
                    className="p-1.5 text-neutral-meta hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="삭제"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <div className="flex-1 pr-16">
                  <h3 className="text-xl font-bold text-neutral-main mb-3 group-hover:text-primary transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-[14px] text-neutral-meta line-clamp-3 leading-relaxed">
                    {idea.content}
                  </p>
                </div>
                
                <div className="pt-5 mt-5 border-t border-gray-100 flex items-center gap-4 text-[13px] text-neutral-meta shrink-0">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-main">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-[12px]">
                      {(idea.author || 'U')[0].toUpperCase()}
                    </div>
                    <span>{idea.author || '익명'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock size={13} />
                    <span>{formatDate(idea.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteIdeaId}
        title="게시물 삭제"
        message="정말 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIdeaId(null)}
      />
    </div>
  );
}
