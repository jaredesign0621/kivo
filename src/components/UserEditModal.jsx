import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function UserEditModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: '활성',
    marketing: 'N'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        status: user.status || '활성',
        marketing: user.marketing || 'N'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] animate-fade-in backdrop-blur-sm p-4">
      <div className="bg-white rounded-md shadow-floating w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-neutral-main">사용자 정보 수정</h2>
            <p className="text-[12px] text-neutral-meta mt-0.5">사용자의 상세 정보를 수정합니다.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-neutral-main transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-neutral-main">아이디</label>
            <input 
              type="text" 
              value={user?.id || ''} 
              disabled 
              className="h-10 px-3 rounded-sm border border-gray-200 bg-gray-100 text-neutral-meta outline-none text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-neutral-main">이름</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="이름을 입력해주세요"
              className="h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-neutral-main">연락처</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="연락처를 입력해주세요"
              className="h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-neutral-main">이메일</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="이메일을 입력해주세요"
              className="h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-neutral-main">상태</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-[14px]"
            >
              <option value="활성">활성</option>
              <option value="대기중">대기중</option>
              <option value="정지">정지</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="marketing-agreement"
              checked={formData.marketing === 'Y'}
              onChange={(e) => setFormData(prev => ({ ...prev, marketing: e.target.checked ? 'Y' : 'N' }))}
              className="w-4 h-4 rounded-sm border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="marketing-agreement" className="text-[13px] text-neutral-main select-none cursor-pointer">마케팅 정보 수신 동의</label>
          </div>

          <div className="bg-gray-50/80 px-6 py-4 flex justify-end gap-2 border-t border-gray-100 -mx-6 -mb-6 mt-6 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-neutral-meta hover:bg-gray-200 rounded-sm font-medium transition-colors text-[14px] disabled:opacity-50"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-5 py-2 bg-primary text-white rounded-sm font-bold transition-colors text-[14px] disabled:opacity-50 hover:bg-blue-700"
            >
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
