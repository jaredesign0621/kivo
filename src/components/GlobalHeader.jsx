import React, { useState, useRef, useEffect } from 'react';
import { FiGrid, FiSettings, FiChevronDown, FiSidebar, FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import logoUrl from '../assets/img/logo.png';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ConfirmModal from './ConfirmModal';

export default function GlobalHeader({ onToggleLnb, hasProject = true, onOpenCreateProject }) {
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const projectMenuRef = useRef(null);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '' });

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target)) {
        setIsProjectMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('kivo_local_role');
      localStorage.removeItem('kivo_has_project');
      await signOut(auth);
      window.location.reload(); // 로컬 강제 로그인 상태도 해제하기 위해 새로고침
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
    }
  };

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
                  <div className="flex flex-col mt-1 px-4 py-2 text-[13px] text-gray-400">
                    최근 참여한 프로젝트가 없습니다.
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
        
        {/* Profile Dropdown */}
        <div className="relative ml-1" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all focus:outline-none"
          >
            <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full object-cover" />
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-floating py-1 z-50 animate-fade-in">
              <button 
                className="w-full text-left px-4 py-2.5 text-[14px] text-neutral-main hover:bg-gray-50 hover:text-primary flex items-center gap-2 transition-colors"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  // TODO: 프로필 편집 모달 오픈 연결
                  setAlertConfig({
                    isOpen: true,
                    title: '프로필 편집',
                    message: '프로필 편집 기능은 준비 중입니다.'
                  });
                }}
              >
                <FiUser size={16} /> 프로필 편집
              </button>
              <div className="h-[1px] bg-gray-100 my-1"></div>
              <button 
                className="w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut size={16} /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="확인"
        showCancel={false}
        onConfirm={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </header>
  );
}
