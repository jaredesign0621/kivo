import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

export default function DocumentManageModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim());
    onClose();
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-floating w-full max-w-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-base font-bold text-neutral-main">
            {isEdit ? '문서 이름 수정' : '새 문서 만들기'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-neutral-main transition-colors">
            <FiX size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-neutral-main mb-1.5">
              문서 이름
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 주간 회의록"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-ui transition-colors bg-white"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-1.5 text-neutral-meta hover:bg-gray-100 rounded-sm font-medium transition-colors text-[13px]"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={!title.trim()}
              className="px-4 py-1.5 bg-primary hover:bg-blue-700 text-white rounded-sm font-bold transition-colors text-[13px] flex items-center gap-1.5 disabled:opacity-50"
            >
              <FiCheck size={14} /> {isEdit ? '수정' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
