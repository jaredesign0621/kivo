import React from 'react';
import { FiArrowLeft, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function IdeaDetail({ idea, boardTitle, onBack, onEdit, onDelete }) {
  if (!idea) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bg-base p-8 relative flex flex-col">
      <div className="w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-neutral-meta hover:text-primary transition-colors text-[14px] font-medium mb-6"
        >
          <FiArrowLeft size={16} /> 목록으로 돌아가기
        </button>

        <div className="bg-white rounded-md border border-gray-200 shadow-sm p-8 min-h-[500px]">
          <header className="border-b border-gray-100 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-neutral-main leading-tight">{idea.title}</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(idea)}
                  className="text-neutral-meta hover:text-primary p-1.5 rounded hover:bg-gray-50 transition-colors flex items-center gap-1 text-[13px]"
                >
                  <FiEdit2 size={14} /> 수정
                </button>
                <button 
                  onClick={() => onDelete(idea.id)}
                  className="text-neutral-meta hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors flex items-center gap-1 text-[13px]"
                >
                  <FiTrash2 size={14} /> 삭제
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-[14px] text-neutral-meta">
              <div className="flex items-center gap-2 font-medium text-neutral-main">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-[13px]">
                  {(idea.author || 'U')[0].toUpperCase()}
                </div>
                <span>{idea.author || '익명 사용자'}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span>{formatDate(idea.createdAt)}</span>
              <span className="text-gray-300">|</span>
              <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-sm text-[12px]">{boardTitle}</span>
            </div>
          </header>

          <article className="prose max-w-none text-neutral-main leading-relaxed tiptap-wrapper">
            <style>{`
              .tiptap-wrapper a { color: #0052CC; text-decoration: underline; }
              .tiptap-wrapper img { max-width: 100%; height: auto; border-radius: 4px; margin: 1rem 0; }
              .tiptap-wrapper table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 1rem 0; overflow: hidden; }
              .tiptap-wrapper table td, .tiptap-wrapper table th { min-width: 1em; border: 1px solid #E5E7EB; padding: 0.5rem; vertical-align: top; }
              .tiptap-wrapper table th { font-weight: bold; text-align: left; background-color: #F9FAFB; }
              .tiptap-wrapper ul[data-type="taskList"] { list-style: none; padding: 0; }
              .tiptap-wrapper ul[data-type="taskList"] li { display: flex; align-items: flex-start; margin-bottom: 0.5rem; }
              .tiptap-wrapper ul[data-type="taskList"] li > label { margin-right: 0.5rem; user-select: none; }
            `}</style>
            
            {idea.htmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: idea.htmlContent }} />
            ) : (
              <div className="whitespace-pre-wrap">{idea.content}</div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
