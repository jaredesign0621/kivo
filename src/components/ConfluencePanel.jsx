import React from 'react';
import { FiChevronDown, FiMoreHorizontal, FiPlus } from 'react-icons/fi';
import SlashCommandPopover from './SlashCommandPopover';

export default function ConfluencePanel({ isLnbOpen = true }) {
  return (
    <>
      {/* Sidebar with slide transition */}
      <div 
        className={`shrink-0 h-full flex flex-col bg-bg-panel transition-all duration-300 ease-in-out overflow-hidden ${
          isLnbOpen ? 'w-64 border-r border-gray-200 opacity-100' : 'w-0 border-none opacity-0'
        }`}
      >
        <nav className="flex-1 overflow-y-auto p-2 w-64">
          <div className="group flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <FiChevronDown className="text-neutral-meta shrink-0" size={14} />
              <span className="text-sm shrink-0">📄</span>
              <span className="text-ui truncate">GNB 네비게이션 설계</span>
            </div>
            <div className="hidden group-hover:flex items-center gap-1 text-neutral-meta">
              <button className="p-0.5 hover:text-neutral-main hover:bg-gray-300 rounded"><FiMoreHorizontal size={14} /></button>
              <button className="p-0.5 hover:text-neutral-main hover:bg-gray-300 rounded"><FiPlus size={14} /></button>
            </div>
          </div>
        </nav>
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
