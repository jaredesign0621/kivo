import React from 'react';
import JiraIssueCard from './JiraIssueCard';

export default function JiraPanel() {
  return (
    <div className="w-full h-full flex flex-col bg-bg-base border-l border-gray-200">
      <header className="h-14 px-6 flex items-center border-b border-gray-200 shrink-0">
        <h2 className="text-h2 font-semibold">Sprint 24: Navigation Sync</h2>
      </header>

      <div className="flex-1 overflow-x-auto p-6 flex gap-4 bg-bg-panel">
        
        <div className="w-72 shrink-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-ui font-semibold text-neutral-meta uppercase">To Do</span>
            <span className="text-ui text-neutral-meta bg-gray-200 px-2 py-0.5 rounded-sm">4 / 5</span>
          </div>
          
          <div className="flex flex-col gap-3">
             <JiraIssueCard 
               issue={{ 
                 key: 'PROJ-123', type: 'Task', 
                 title: '메인 대시보드 GNB 내비게이션 컴포넌트 정밀 그리드 설계',
                 storyPoints: 5, dueDate: '7월 15일', assigneeName: 'Jared Kim',
                 assigneeAvatar: 'https://i.pravatar.cc/100?img=11'
               }} 
             />
             <JiraIssueCard 
               issue={{ 
                 key: 'PROJ-124', type: 'Bug', 
                 title: 'GNB 호버 시 깜빡임 현상 수정',
                 storyPoints: 2, dueDate: '7월 16일', assigneeName: 'Alice',
                 assigneeAvatar: 'https://i.pravatar.cc/100?img=5'
               }} 
             />
          </div>
        </div>

        <div className="w-72 shrink-0 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-ui font-semibold text-status-warning-text uppercase">In Progress</span>
            <span className="text-ui font-bold text-status-warning-text bg-status-warning-bg px-2 py-0.5 rounded-sm">
              4 / 3 (초과)
            </span>
          </div>
          <div className="flex flex-col gap-3">
             <JiraIssueCard 
               issue={{ 
                 key: 'PROJ-102', type: 'Epic', 
                 title: '하이브리드 워크스페이스 반응형 UI/UX 설계',
                 storyPoints: 13, dueDate: '8월 1일', assigneeName: 'Jared Kim',
                 assigneeAvatar: 'https://i.pravatar.cc/100?img=11'
               }} 
             />
             <div className="mt-2 bg-status-warning-bg/30 p-3 rounded border-dashed border-2 border-red-200 flex items-center justify-center">
               <span className="text-ui text-status-warning-text font-medium">WIP 제한 초과됨</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
