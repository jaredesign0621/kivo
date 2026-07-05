import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiMoreHorizontal, FiPlus, FiUserPlus } from 'react-icons/fi';
import SlashCommandPopover from './SlashCommandPopover';

export default function ConfluencePanel({ isLnbOpen = true }) {
  const [isIdeaExpanded, setIsIdeaExpanded] = useState(true);

  return (
    <>
      {/* Sidebar with slide transition */}
      <div 
        className={`shrink-0 h-full flex flex-col bg-bg-panel transition-all duration-300 ease-in-out overflow-hidden ${
          isLnbOpen ? 'w-64 border-r border-gray-200 opacity-100' : 'w-0 border-none opacity-0'
        }`}
      >
        <nav className="flex-1 overflow-y-auto p-2 w-64">
          <div>
            {/* 1Depth: 아이디어 */}
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
                <button 
                  className="ml-0.5 p-0.5 hover:text-primary hover:bg-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity text-neutral-meta shrink-0"
                  title="하위 항목 추가"
                  onClick={(e) => {
                    e.stopPropagation(); // 접힘/펼침 방지
                  }}
                >
                  <FiPlus size={14} />
                </button>
              </div>
              <div className="hidden group-hover:flex items-center gap-1 text-neutral-meta">
                <button 
                  className="p-0.5 hover:text-neutral-main hover:bg-gray-300 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiMoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* 2Depth Items */}
            {isIdeaExpanded && (
              <div className="pl-6 mt-0.5 flex flex-col gap-0.5">
                <div className="py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors text-[13px] text-neutral-meta hover:text-neutral-main truncate">
                  신규 서비스 기획안
                </div>
                <div className="py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors text-[13px] text-neutral-meta hover:text-neutral-main truncate">
                  사용자 리서치 결과
                </div>
                <div className="py-1.5 px-2 rounded-sm bg-gray-200 cursor-pointer transition-colors text-[13px] font-medium text-neutral-main truncate">
                  GNB 컴포넌트 설계
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* 하단 초대하기 영역 */}
        <div className="p-3 w-64 border-t border-gray-200 shrink-0">
          <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-neutral-main py-2 rounded-sm font-medium transition-colors text-[13px]">
            <FiUserPlus size={16} /> 프로젝트 멤버 초대
          </button>
        </div>
      </div>

      {/* Resizable Splitter (Hidden when LNB is closed) */}
      <div className={`w-1 cursor-col-resize hover:bg-primary transition-colors z-10 ${!isLnbOpen && 'hidden'}`} />

      {/* Main Editor Area */}
      <article className="flex-1 h-full bg-bg-base overflow-y-auto flex flex-col relative transition-all duration-300">
        <header className="h-14 px-8 flex items-center justify-between shrink-0">
          <div className="text-ui text-neutral-meta">
            Design System / <span className="text-neutral-main font-semibold">GNB Component</span>
          </div>
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full border-2 border-bg-base bg-blue-500 z-20"></div>
            <div className="w-7 h-7 rounded-full border-2 border-bg-base bg-green-500 z-10"></div>
          </div>
        </header>

        <div className="flex-1 px-16 py-8 max-w-3xl mx-auto w-full relative">
          <h1 className="text-h1 mb-6 text-neutral-main outline-none" contentEditable suppressContentEditableWarning>
            메인 대시보드 GNB 내비게이션 컴포넌트 설계
          </h1>
          <p className="text-body text-neutral-main mb-4 outline-none leading-relaxed" contentEditable suppressContentEditableWarning>
            본 문서는 사용자가 컨텍스트 스위칭 없이 GNB 영역에서 모든 주요 액션을 수행할 수 있도록 설계된 인터랙션 가이드입니다. 
            특히 <span className="bg-yellow-100 cursor-text">드래그 앤 드롭 티켓 생성</span>과 같은 스마트 링크 기능이 포함됩니다.
          </p>
          <div className="text-body text-neutral-meta flex items-center gap-2 mt-4 cursor-text relative">
            <span>명령어를 입력하려면</span> 
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-sm text-code"> / </kbd>
            <span>를 누르세요.</span>
          </div>
          
          <SlashCommandPopover />
        </div>
      </article>
    </>
  );
}
