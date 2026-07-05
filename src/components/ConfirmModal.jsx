import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = '확인', 
  cancelText = '취소', 
  isDestructive = false,
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={!isLoading ? onCancel : undefined} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-md shadow-floating w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-primary'}`}>
              <FiAlertTriangle size={20} />
            </div>
            <div className="pt-1">
              <h3 className="text-lg font-bold text-neutral-main mb-2 leading-none">{title}</h3>
              <p className="text-[14px] text-neutral-meta leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 px-6 py-4 flex justify-end gap-2 border-t border-gray-100">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-neutral-meta hover:bg-gray-200 rounded-sm font-medium transition-colors text-[14px] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 text-white rounded-sm font-bold transition-colors text-[14px] disabled:opacity-50 ${
              isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-blue-700'
            }`}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
