import React, { useState } from 'react';
import loginLogoUrl from '../assets/img/login_logo.png';
import SignupModal from './SignupModal';

export default function Login({ onLogin }) {
  const [id, setId] = useState('tester1');
  const [password, setPassword] = useState('0621');
  const [error, setError] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 관리자 계정 확인
    if (id === 'admin' && password === 'admin') {
      setError('');
      onLogin('admin');
    } 
    // 일반 테스트 계정 확인
    else if (id === 'tester1' && password === '0621') {
      setError('');
      onLogin('user');
    } 
    // 실패
    else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-panel flex items-center justify-center p-4 selection:bg-primary selection:text-white">
      <div className="max-w-[400px] w-full bg-white rounded-md shadow-floating p-8">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={loginLogoUrl} alt="Login Logo" className="w-12 h-12 rounded mb-3 object-contain" />
          <h1 className="text-h2 font-bold text-neutral-main tracking-tight">KIVO 로그인</h1>
          <p className="text-ui text-neutral-meta mt-1">로그인을 진행해주세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* 에러 메시지 표시 */}
          {error && (
            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-sm border border-red-100">
              {error}
            </div>
          )}

          {/* 1. 아이디 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-ui font-semibold text-neutral-main" htmlFor="email">아이디 또는 이메일</label>
            <input 
              id="email" 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="tester1"
              className="w-full h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body placeholder:text-gray-400"
              required
            />
          </div>

          {/* 2. 비밀번호 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-ui font-semibold text-neutral-main" htmlFor="password">비밀번호</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body placeholder:text-gray-400"
              required
            />
          </div>

          {/* 3. 아이디 저장 */}
          <div className="flex items-center mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-ui text-neutral-main group-hover:text-primary transition-colors">아이디 저장</span>
            </label>
          </div>

          {/* 4. 로그인 버튼 */}
          <button 
            type="submit"
            className="w-full h-10 mt-2 bg-primary hover:bg-blue-700 text-white font-semibold rounded-sm transition-colors shadow-sm"
          >
            로그인
          </button>

          {/* 테스트용 관리자 로그인 버튼 */}
          <button 
            type="button"
            onClick={() => onLogin('admin')}
            className="w-full h-10 mt-2 border border-gray-300 hover:bg-gray-50 text-neutral-main font-semibold rounded-sm transition-colors shadow-sm"
          >
            (테스트용) 관리자로 바로 진입
          </button>
        </form>

        {/* 5, 6. 보조 링크 영역 */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-3 text-ui relative">
          <button 
            type="button" 
            onClick={() => {
              setAlertMessage('구현중입니다. 관리자에게 문의하세요.');
              setTimeout(() => setAlertMessage(''), 3000);
            }}
            className="text-primary hover:underline font-medium"
          >
            아이디 / 비밀번호 찾기
          </button>
          
          {/* 커스텀 알럿 UI */}
          {alertMessage && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-sm shadow-floating text-sm font-medium whitespace-nowrap animate-fade-in-up z-50">
              {alertMessage}
            </div>
          )}

          <div className="text-neutral-meta flex items-center gap-1.5">
            <span>계정이 없으신가요?</span>
            <button 
              type="button" 
              onClick={() => setIsSignupOpen(true)}
              className="text-primary hover:underline font-medium"
            >
              회원가입
            </button>
          </div>
        </div>

      </div>

      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </div>
  );
}
