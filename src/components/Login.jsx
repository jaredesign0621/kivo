import React, { useState } from 'react';
import loginLogoUrl from '../assets/img/login_logo.png';
import SignupModal from './SignupModal';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [id, setId] = useState(import.meta.env.DEV ? 'tester1' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? '0621' : '');
  const [error, setError] = useState('');
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // 최고 관리자 계정 하드코딩 패스
    if (id === 'admin' && password === 'admin') {
      onLogin('admin');
      return;
    }

    // 로컬 개발 환경에서만 허용되는 강제 로그인(하드코딩)
    if (import.meta.env.DEV) {
      if (id === 'tester1' && password === '0621') {
        onLogin('user');
        return;
      }
    }

    // 실제 Firebase Auth 로그인 처리
    setIsLoading(true);
    try {
      // SignupModal에서 아이디에 '@kivo.com'을 붙여 가입시키므로 동일하게 변환하여 로그인
      const virtualEmail = id.includes('@') ? id : `${id}@kivo.com`;
      await signInWithEmailAndPassword(auth, virtualEmail, password);
      onLogin('user'); // 실제 유저는 기본 'user' 롤
    } catch (err) {
      console.error('Login error:', err);
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
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
              placeholder="아이디"
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
              placeholder="비밀번호"
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
            disabled={isLoading}
            className="w-full h-10 mt-2 bg-primary hover:bg-blue-700 text-white font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 테스트용 관리자 로그인 버튼 (로컬 환경에서만 노출) */}
          {import.meta.env.DEV && (
            <button 
              type="button"
              onClick={() => onLogin('admin')}
              className="w-full h-10 mt-2 border border-gray-300 hover:bg-gray-50 text-neutral-main font-semibold rounded-sm transition-colors shadow-sm"
            >
              (테스트용) 관리자로 바로 진입
            </button>
          )}
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
