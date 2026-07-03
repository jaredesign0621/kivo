import React, { useState, useEffect } from 'react';
import { FiFileText, FiTrello, FiMessageSquare, FiEdit3, FiPlus } from 'react-icons/fi';
import GlobalHeader from './GlobalHeader';
import ConfluencePanel from './ConfluencePanel';
import JiraPanel from './JiraPanel';

export default function WorkspaceLayout() {
  const [isLnbOpen, setIsLnbOpen] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState('document');
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

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
      <GlobalHeader onToggleLnb={() => setIsLnbOpen(!isLnbOpen)} />
      
      {/* Mobile Tab Switcher (Visible only on < md screens) */}
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

      {/* Main Content Area */}
      <main className="w-full flex-1 min-h-0">
        <div className="flex h-full w-full">
          {/* Confluence Panel: Hidden on mobile if not 'document' tab */}
          <section className={`flex-1 md:flex-[6] min-w-0 h-full bg-bg-panel overflow-hidden relative border-r border-gray-200 ${
            activeMobileTab === 'document' ? 'flex' : 'hidden'
          } md:flex`}>
             <ConfluencePanel isLnbOpen={isLnbOpen} />
          </section>

          {/* Jira Panel: Hidden on mobile if not 'board' tab */}
          <section className={`flex-1 md:flex-[4] min-w-0 h-full bg-bg-panel overflow-hidden relative ${
            activeMobileTab === 'board' ? 'flex' : 'hidden'
          } md:flex`}>
             <JiraPanel />
          </section>
        </div>
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <button 
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-floating hover:bg-blue-700 active:scale-95 transition-all z-40"
        onClick={() => setBottomSheetOpen(true)}
      >
        {activeMobileTab === 'document' ? <FiEdit3 size={24} /> : <FiPlus size={24} />}
      </button>

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
            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase">Action</span>
            <span className="text-ui text-neutral-meta">QUICK-101</span>
          </div>
          <h2 className="text-h2 mb-2">퀵 액션 시트</h2>
          <div className="text-sm text-neutral-meta bg-bg-panel p-3 rounded">
            여기에 디테일한 정보나 모바일 전용 퀵 액션이 렌더링됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
