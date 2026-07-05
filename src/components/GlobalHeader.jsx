import React, { useState, useRef, useEffect } from 'react';
import { FiGrid, FiSettings, FiChevronDown, FiSidebar, FiMenu } from 'react-icons/fi';
import logoUrl from '../assets/img/logo.png';

export default function GlobalHeader({ onToggleLnb, hasProject = true, onOpenCreateProject }) {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const projectMenuRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target)) {
        setIsProjectMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 px-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 z-50">
      
      {/* Left Section: Logo & Nav */}
      <div className="flex items-center h-full">
        {/* App Switcher (hidden on mobile) */}
        <button className="p-2 hover:bg-gray-100 rounded-sm text-neutral-meta transition-colors mr-1 hidden sm:block">
          <FiGrid size={18} />
        </button>

        {/* LNB Toggle Button (Hamburger on mobile, Sidebar on PC) */}
        <button 
          onClick={onToggleLnb}
          className="p-2 hover:bg-gray-100 rounded-sm text-neutral-meta transition-colors mr-2 md:mr-4"
          title="사이드바 토글"
        >
          <FiSidebar size={18} className="hidden md:block" />
          <FiMenu size={18} className="block md:hidden" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer md:mr-6">
          <img src={logoUrl} alt="KIVO Logo" className="h-7 shrink-0 object-contain" />
        </div>

        {/* Navigation Dropdowns (PC Only) */}
        {hasProject && (
          <nav className="hidden lg:flex h-full text-ui">
            {/* 프로젝트 GNB */}
            <div className="relative h-full flex" ref={projectMenuRef}>
              <button 
                onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                className={`px-3 h-full flex items-center gap-1 transition-colors ${
                  isProjectMenuOpen ? 'bg-blue-50 text-primary' : 'hover:bg-gray-100 hover:text-primary text-neutral-main'
                }`}
              >
                프로젝트 <FiChevronDown size={14} className={`${isProjectMenuOpen ? 'text-primary' : 'text-neutral-meta'}`} />
              </button>
              
              {/* 프로젝트 드롭다운 메뉴 */}
              {isProjectMenuOpen && (
                <div className="absolute top-[100%] left-0 mt-1 w-64 bg-white border border-gray-200 rounded-sm shadow-floating py-2 z-50 animate-fade-in">
                  <div className="px-4 py-1.5 text-[12px] font-bold text-neutral-meta uppercase">최근 프로젝트</div>
                  <div className="flex flex-col mt-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 group">
                      <div className="w-7 h-7 rounded-sm bg-blue-100 text-primary flex items-center justify-center font-bold text-[14px]">K</div>
                      <span className="text-[14px] text-neutral-main font-medium group-hover:text-primary transition-colors">KIVO 프로젝트</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="w-full text-left px-4 py-2 text-[14px] text-neutral-main hover:bg-gray-50 hover:text-primary transition-colors">모든 프로젝트 보기</button>
                    <button 
                      className="w-full text-left px-4 py-2 text-[14px] text-neutral-main hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => {
                        setIsProjectMenuOpen(false);
                        if(onOpenCreateProject) onOpenCreateProject();
                      }}
                    >
                      프로젝트 만들기
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="px-3 h-full flex items-center gap-1 hover:bg-gray-100 hover:text-primary transition-colors text-neutral-main">
              대시보드 <FiChevronDown size={14} className="text-neutral-meta" />
            </button>
            <button className="px-3 h-full flex items-center gap-1 hover:bg-gray-100 hover:text-primary transition-colors text-neutral-main">
              앱 <FiChevronDown size={14} className="text-neutral-meta" />
            </button>
            
            {/* Create Button */}
            <div className="flex items-center ml-2">
              <button className="bg-primary hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-sm transition-colors shadow-sm">
                만들기
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Right Section: Tools */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full text-neutral-meta transition-colors">
          <FiSettings size={18} />
        </button>
        <button className="ml-1 w-8 h-8 rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all">
          <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}
