import React, { useState, useEffect } from 'react';
import { FiFileText, FiTrello, FiMessageSquare, FiEdit3, FiPlus } from 'react-icons/fi';
import GlobalHeader from './GlobalHeader';
import ConfluencePanel from './ConfluencePanel';
import ProjectCreateModal from './ProjectCreateModal';
import ProjectInviteModal from './ProjectInviteModal';
import { auth } from '../firebase';

export default function WorkspaceLayout() {
  const [isLnbOpen, setIsLnbOpen] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState('document');
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  
  // 로컬 스토리지를 이용해 프로젝트가 있는지(생성했는지) 상태를 기억하도록 시뮬레이션합니다. (계정별 분리)
  const [hasProject, setHasProject] = useState(() => {
    const userId = auth.currentUser?.uid || 'guest';
    return localStorage.getItem(`kivo_has_project_${userId}`) === 'true';
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleProjectSuccess = () => {
    const userId = auth.currentUser?.uid || 'guest';
    setIsProjectModalOpen(false);
    setHasProject(true);
    localStorage.setItem(`kivo_has_project_${userId}`, 'true');
  };

  // 화면 크기에 따른 LNB 자동 개폐 로직
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsLnbOpen(false); // 모바일에서는 닫힘
      } else {
        setIsLnbOpen(true); // PC 해상도 복귀 시 열림
      }
    };
    // 초기 로드 시에도 체크
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-bg-panel text-neutral-main font-sans selection:bg-primary selection:text-white relative">
      <GlobalHeader 
        onToggleLnb={() => setIsLnbOpen(!isLnbOpen)} 
        hasProject={hasProject} 
        onOpenCreateProject={() => setIsProjectModalOpen(true)}
      />
      
      {/* Mobile Tab Switcher (Visible only on < md screens & when project exists) */}
      {hasProject && (
        <div className="md:hidden sticky top-0 z-40 bg-bg-base border-b border-gray-200 px-4 pt-2 pb-2 shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-md">
          <button 
            onClick={() => setActiveMobileTab('document')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-sm text-ui font-medium transition-all ${
              activeMobileTab === 'document' ? 'bg-white shadow-sm text-neutral-main' : 'text-neutral-meta'
            }`}
          >
            <FiFileText size={14} /> 문서
          </button>
          <button 
            onClick={() => setActiveMobileTab('board')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-sm text-ui font-medium transition-all ${
              activeMobileTab === 'board' ? 'bg-white shadow-sm text-neutral-main' : 'text-neutral-meta'
            }`}
          >
            <FiTrello size={14} /> 보드
          </button>
          <button 
            onClick={() => setActiveMobileTab('discussions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-sm text-ui font-medium transition-all ${
              activeMobileTab === 'discussions' ? 'bg-white shadow-sm text-neutral-main' : 'text-neutral-meta'
            }`}
          >
            <FiMessageSquare size={14} /> 논의
          </button>
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <main className="w-full flex-1 min-h-0">
        {!hasProject ? (
          <div className="flex flex-col items-center justify-center h-full w-full bg-white text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <FiTrello size={36} className="text-gray-400" />
            </div>
            <h2 className="text-[22px] font-bold text-neutral-main mb-3">진행할 프로젝트를 등록하세요.</h2>
            <p className="text-neutral-meta mb-8 text-[15px]">현재 참여 중이거나 진행 중인 프로젝트가 없습니다.<br/>새로운 프로젝트를 생성하고 팀과 함께 협업을 시작해 보세요!</p>
            <button 
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-sm font-bold text-[15px] hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
            >
              <FiPlus size={20} /> 프로젝트 등록
            </button>
          </div>
        ) : (
          <div className="flex h-full w-full animate-fade-in">
            {/* Main Area: Confluence Panel spans full width */}
            <section className={`flex-1 min-w-0 h-full bg-bg-panel overflow-hidden relative ${
              activeMobileTab === 'document' ? 'flex' : 'hidden'
            } md:flex`}>
               <ConfluencePanel isLnbOpen={isLnbOpen} onOpenInviteModal={() => setIsInviteModalOpen(true)} />
            </section>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      {hasProject && (
        <button 
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-floating hover:bg-blue-700 active:scale-95 transition-all z-40"
          onClick={() => setBottomSheetOpen(true)}
        >
          {activeMobileTab === 'document' ? <FiEdit3 size={24} /> : <FiPlus size={24} />}
        </button>
      )}

      {/* Mobile Bottom Sheet (Visible only on < md screens when triggered) */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity ${isBottomSheetOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setBottomSheetOpen(false)}
      />
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 h-[70vh] bg-white rounded-t-2xl shadow-floating z-50 transform transition-transform duration-300 ease-in-out ${isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" onClick={() => setBottomSheetOpen(false)}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="p-5 h-full overflow-y-auto pb-10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-lg">새로 만들기</h3>
          </div>
          <h2 className="text-h2 mb-2">퀵 액션 시트</h2>
          <div className="text-sm text-neutral-meta bg-bg-panel p-3 rounded">
            여기에 디테일한 정보나 모바일 전용 퀵 액션이 렌더링됩니다.
          </div>
        </div>
      </div>
      
      <ProjectCreateModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={handleProjectSuccess}
      />

      <ProjectInviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
