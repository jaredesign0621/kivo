import React from 'react';
import { FiCheckSquare, FiAlertCircle, FiBookmark, FiZap } from 'react-icons/fi';

export default function JiraIssueCard({ issue }) {
  const getTypeConfig = (type) => {
    switch (type) {
      case 'Epic':   return { icon: <FiZap />, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-t-4 border-t-purple-500' };
      case 'Story':  return { icon: <FiBookmark />, color: 'text-green-600', bg: 'bg-green-100', border: 'border-t border-gray-200' };
      case 'Task':   return { icon: <FiCheckSquare />, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-t border-gray-200' };
      case 'Bug':    return { icon: <FiAlertCircle />, color: 'text-red-600', bg: 'bg-red-100', border: 'border-t border-gray-200' };
      default:       return { icon: <FiCheckSquare />, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-t border-gray-200' };
    }
  };

  const config = getTypeConfig(issue.type);

  return (
    <div className={`
      bg-bg-base rounded p-3 shadow-sm border border-gray-200 flex flex-col gap-2 
      cursor-grab active:cursor-grabbing hover:shadow-floating hover:-translate-y-0.5 transition-all
      ${config.border}
    `}>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-sm flex items-center justify-center ${config.bg} ${config.color}`}>
            {React.cloneElement(config.icon, { size: 12, strokeWidth: 3 })}
          </div>
          <span className="text-ui text-neutral-meta font-mono font-medium hover:underline cursor-pointer">
            {issue.key}
          </span>
        </div>
        
        {issue.type === 'Epic' && (
          <span className="text-[10px] font-bold uppercase bg-purple-600 text-white px-1.5 py-0.5 rounded-sm">
            Epic
          </span>
        )}
      </div>

      <div>
        <h3 className="text-ui font-medium text-neutral-main leading-snug line-clamp-2">
          {issue.title}
        </h3>
      </div>

      <div className="flex items-end justify-between mt-1">
        <div className="flex items-center gap-2">
          <div className="bg-gray-200 text-neutral-main text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
            {issue.storyPoints || '-'}
          </div>
          {issue.dueDate && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-meta bg-bg-panel px-1.5 py-0.5 rounded-sm">
              <span>📅</span>
              <span>{issue.dueDate}</span>
            </div>
          )}
        </div>

        <div className="relative group cursor-pointer">
          <img 
            src={issue.assigneeAvatar || "https://i.pravatar.cc/100?img=11"} 
            alt="Assignee" 
            className="w-6 h-6 rounded-full border border-gray-200 object-cover"
          />
          <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block whitespace-nowrap bg-neutral-main text-white text-[10px] px-2 py-1 rounded-sm z-10">
            {issue.assigneeName}
          </div>
        </div>
      </div>
      
    </div>
  );
}
