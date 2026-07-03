import React from 'react';
import { FiGrid, FiSettings, FiChevronDown, FiSidebar, FiMenu } from 'react-icons/fi';

export default function GlobalHeader({ onToggleLnb }) {
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
          <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[14px]">K</span>
          </div>
          <span className="text-h2 font-bold text-neutral-main tracking-tight hidden sm:block">KIVO</span>
        </div>

        {/* Navigation Dropdowns (PC Only) */}
        <nav className="hidden lg:flex h-full text-ui">
          <button className="px-3 h-full flex items-center gap-1 hover:bg-gray-100 hover:text-primary transition-colors text-neutral-main">
            프로젝트 <FiChevronDown size={14} className="text-neutral-meta" />
          </button>
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
