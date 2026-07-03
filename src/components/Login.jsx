import React from 'react';

export default function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // 성공적인 로그인을 시뮬레이션
  };

  return (
    <div className="min-h-screen bg-bg-panel flex items-center justify-center p-4 selection:bg-primary selection:text-white">
      <div className="max-w-[400px] w-full bg-white rounded-md shadow-floating p-8">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded flex items-center justify-center mb-3">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-h2 font-bold text-neutral-main tracking-tight">KIVO에 로그인</h1>
          <p className="text-ui text-neutral-meta mt-1">계속하려면 로그인을 진행해주세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* 1. 아이디 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-ui font-semibold text-neutral-main" htmlFor="email">아이디 또는 이메일</label>
            <input 
              id="email" 
              type="text" 
              placeholder="user@example.com"
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
        </form>

        {/* 5, 6. 보조 링크 영역 */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-3 text-ui">
          <button type="button" className="text-primary hover:underline font-medium">
            아이디 / 비밀번호 찾기
          </button>
          <div className="text-neutral-meta flex items-center gap-1.5">
            <span>계정이 없으신가요?</span>
            <button type="button" className="text-primary hover:underline font-medium">
              회원가입
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
