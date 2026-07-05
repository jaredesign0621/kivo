import React, { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiLogOut, 
  FiBell, 
  FiSearch,
  FiTrendingUp,
  FiActivity,
  FiUserPlus,
  FiBox,
  FiDownload,
  FiMoreVertical,
  FiFilter
} from 'react-icons/fi';
import logoUrl from '../assets/img/logo.png';

export default function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="flex h-screen bg-bg-panel text-body selection:bg-primary selection:text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-6 border-b border-gray-200">
          <img src={logoUrl} alt="KIVO Admin" className="h-6 object-contain" />
          <span className="ml-2 font-bold text-neutral-main tracking-tight mt-0.5">ADMIN</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          <MenuButton 
            icon={<FiHome />} label="대시보드" 
            isActive={activeMenu === 'dashboard'} 
            onClick={() => setActiveMenu('dashboard')} 
          />
          <MenuButton 
            icon={<FiUsers />} label="사용자 관리" 
            isActive={activeMenu === 'users'} 
            onClick={() => setActiveMenu('users')} 
          />
          <MenuButton 
            icon={<FiBox />} label="프로젝트 관리" 
            isActive={activeMenu === 'projects'} 
            onClick={() => setActiveMenu('projects')} 
          />
          <MenuButton 
            icon={<FiFileText />} label="콘텐츠 관리" 
            isActive={activeMenu === 'content'} 
            onClick={() => setActiveMenu('content')} 
          />
          <MenuButton 
            icon={<FiSettings />} label="시스템 설정" 
            isActive={activeMenu === 'settings'} 
            onClick={() => setActiveMenu('settings')} 
          />
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="text-ui font-semibold text-neutral-main leading-tight">최고 관리자</p>
              <p className="text-[12px] text-neutral-meta">admin@kivo.com</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full py-2 text-ui text-neutral-meta hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
          >
            <FiLogOut /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-neutral-main">
            {activeMenu === 'dashboard' && '대시보드'}
            {activeMenu === 'users' && '사용자 관리'}
            {activeMenu === 'projects' && '프로젝트 관리'}
            {activeMenu === 'content' && '콘텐츠 관리'}
            {activeMenu === 'settings' && '시스템 설정'}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="검색어 입력..." 
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-ui focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-neutral-meta hover:bg-gray-100 rounded-full transition-colors">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {activeMenu === 'dashboard' && (
            <div className="p-6 h-full">
              <DashboardContent />
            </div>
          )}
          {activeMenu === 'users' && <UsersManagementContent />}
          {activeMenu !== 'dashboard' && activeMenu !== 'users' && (
            <div className="p-6 h-full">
              <PlaceholderContent label={activeMenu} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Subcomponents
function MenuButton({ icon, label, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-ui transition-colors w-full text-left ${
        isActive 
          ? 'bg-blue-50 text-primary font-semibold' 
          : 'text-neutral-main hover:bg-gray-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function DashboardContent() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="총 가입자 수" value="12,405" change="+12%" icon={<FiUsers className="text-blue-500" />} trend="up" />
        <MetricCard title="오늘 신규 가입" value="142" change="+5.4%" icon={<FiUserPlus className="text-green-500" />} trend="up" />
        <MetricCard title="활성 프로젝트" value="3,820" change="-1.2%" icon={<FiBox className="text-purple-500" />} trend="down" />
        <MetricCard title="서버 상태" value="정상" change="99.9% Uptime" icon={<FiActivity className="text-teal-500" />} trend="neutral" />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Users Table (Takes 2 columns on large screens) */}
        <div className="xl:col-span-2 bg-white rounded-md shadow-floating border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-main">최근 가입 사용자</h2>
            <button className="text-ui text-primary hover:underline">모두 보기</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-ui">
              <thead className="bg-gray-50 text-neutral-meta border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-medium">이름</th>
                  <th className="px-5 py-3 font-medium">이메일</th>
                  <th className="px-5 py-3 font-medium">가입일</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-neutral-main">
                <UserRow name="김지수" email="jisoo@example.com" date="2026-07-05" status="활성" />
                <UserRow name="이민호" email="minho.lee@example.com" date="2026-07-04" status="활성" />
                <UserRow name="박서준" email="seojun.p@example.com" date="2026-07-04" status="대기중" />
                <UserRow name="최유진" email="yujin.choi@example.com" date="2026-07-03" status="활성" />
                <UserRow name="정태호" email="taeho99@example.com" date="2026-07-02" status="정지" />
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs (Takes 1 column) */}
        <div className="bg-white rounded-md shadow-floating border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-neutral-main">시스템 알림</h2>
          </div>
          <div className="flex-1 p-5 space-y-4">
            <LogItem type="warning" message="데이터베이스 백업 지연됨" time="10분 전" />
            <LogItem type="success" message="새로운 배포 완료 (v1.2.4)" time="1시간 전" />
            <LogItem type="info" message="정기 서버 점검 안내" time="3시간 전" />
            <LogItem type="error" message="결제 API 응답 오류" time="어제" />
          </div>
        </div>
        
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, trend }) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  return (
    <div className="bg-white p-5 rounded-md shadow-floating border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-ui text-neutral-meta">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-md">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-neutral-main mb-1">{value}</div>
        <div className="flex items-center gap-1.5 text-sm">
          {trend === 'up' && <FiTrendingUp className={trendColor} />}
          <span className={`font-medium ${trendColor}`}>{change}</span>
          <span className="text-gray-400">vs 지난달</span>
        </div>
      </div>
    </div>
  );
}

function UserRow({ name, email, date, status }) {
  const statusColors = {
    '활성': 'bg-green-100 text-green-700',
    '대기중': 'bg-yellow-100 text-yellow-700',
    '정지': 'bg-red-100 text-red-700'
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3 font-medium">{name}</td>
      <td className="px-5 py-3 text-neutral-meta">{email}</td>
      <td className="px-5 py-3 text-neutral-meta">{date}</td>
      <td className="px-5 py-3">
        <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function LogItem({ type, message, time }) {
  const colors = {
    warning: 'bg-yellow-100 text-yellow-600',
    success: 'bg-green-100 text-green-600',
    info: 'bg-blue-100 text-blue-600',
    error: 'bg-red-100 text-red-600'
  };
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${colors[type].split(' ')[0].replace('100', '500')}`} />
      <div>
        <p className="text-ui text-neutral-main leading-snug">{message}</p>
        <p className="text-[12px] text-neutral-meta mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function PlaceholderContent({ label }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-neutral-meta py-20">
      <FiFileText size={48} className="mb-4 text-gray-300" />
      <h2 className="text-lg font-medium text-neutral-main mb-2">{label === 'users' ? '사용자 관리' : label === 'projects' ? '프로젝트 관리' : label === 'content' ? '콘텐츠 관리' : '시스템 설정'} 화면</h2>
      <p className="text-ui">현재 이 화면은 준비 중입니다. 기능 구현이 필요하면 말씀해 주세요!</p>
    </div>
  );
}

function UsersManagementContent() {
  // 가상의 사용자 데이터 목록
  const dummyUsers = [
    { id: 'admin', name: '최고 관리자', profileUrl: 'https://i.pravatar.cc/150?u=admin', phone: '010-0000-0000', email: 'admin@kivo.com', date: '2026-07-01', marketing: 'N', status: '활성' },
    { id: 'tester1', name: '김테스트', profileUrl: null, phone: '010-1234-5678', email: 'tester1@kivo.com', date: '2026-07-05', marketing: 'Y', status: '활성' },
    { id: 'devlee', name: '이개발', profileUrl: 'https://i.pravatar.cc/150?u=devlee', phone: '010-9876-5432', email: 'devlee@example.com', date: '2026-07-04', marketing: 'N', status: '활성' },
    { id: 'designpark', name: '박디자인', profileUrl: 'https://i.pravatar.cc/150?u=designpark', phone: '010-1111-2222', email: 'park@example.com', date: '2026-07-03', marketing: 'Y', status: '대기중' },
    { id: 'baduser', name: '정태호', profileUrl: null, phone: '010-9999-8888', email: 'taeho99@example.com', date: '2026-07-02', marketing: 'N', status: '정지' },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="px-6 py-5 flex flex-wrap gap-4 items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <span className="text-ui font-semibold text-neutral-main">총 사용자</span>
          <span className="px-2 py-0.5 bg-blue-100 text-primary text-[12px] font-bold rounded-full">
            {dummyUsers.length}명
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="이름, 아이디, 이메일 검색" 
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-sm text-[13px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-60"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white rounded-sm text-[13px] font-medium text-neutral-meta hover:text-neutral-main hover:bg-gray-50 transition-colors">
            <FiFilter size={14} /> 필터
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-sm text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <FiDownload size={14} /> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto mx-6 border-t border-gray-200">
        <table className="w-full text-left text-[14px] whitespace-nowrap">
          <thead className="bg-gray-50 text-neutral-meta border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-5 py-3 font-medium w-12 text-center">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300" />
              </th>
              <th className="px-5 py-3 font-medium">아이디</th>
              <th className="px-5 py-3 font-medium">이름</th>
              <th className="px-5 py-3 font-medium">연락처</th>
              <th className="px-5 py-3 font-medium">이메일</th>
              <th className="px-5 py-3 font-medium text-center">마케팅 동의</th>
              <th className="px-5 py-3 font-medium">가입일</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 font-medium text-center w-16">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-b border-gray-100 text-neutral-main">
            {dummyUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300" />
                </td>
                <td className="px-5 py-3 font-medium text-primary cursor-pointer hover:underline">{user.id}</td>
                <td className="px-5 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                      {user.profileUrl ? (
                        <img src={user.profileUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[12px] font-bold text-gray-500">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-meta">{user.phone}</td>
                <td className="px-5 py-3 text-neutral-meta">{user.email}</td>
                <td className="px-5 py-3 text-center">
                  {user.marketing === 'Y' ? (
                    <span className="text-green-600 font-bold text-[12px] bg-green-50 px-2 py-0.5 rounded-sm">Y</span>
                  ) : (
                    <span className="text-gray-400 font-medium text-[12px]">N</span>
                  )}
                </td>
                <td className="px-5 py-3 text-neutral-meta text-[13px]">{user.date}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${
                    user.status === '활성' ? 'bg-green-100 text-green-700' :
                    user.status === '대기중' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  <button className="p-1.5 text-gray-400 hover:text-neutral-main hover:bg-gray-200 rounded-sm transition-colors opacity-0 group-hover:opacity-100">
                    <FiMoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mx-6 px-5 py-3 border-y border-gray-200 bg-white flex items-center justify-between text-[13px] text-neutral-meta mb-6">
        <span>1 - 5 / 총 5 명</span>
        <div className="flex gap-1">
          <button className="px-2 py-1 border border-gray-200 rounded-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>이전</button>
          <button className="px-2 py-1 border border-gray-200 rounded-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>다음</button>
        </div>
      </div>
      
    </div>
  );
}
