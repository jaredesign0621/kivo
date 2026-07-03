import React, { useState } from 'react';
import { FiType, FiImage, FiCheckSquare, FiSearch } from 'react-icons/fi';
import { SiJira } from 'react-icons/si';

export default function SlashCommandPopover() {
  const [searchTerm, setSearchTerm] = useState('');

  const commands = [
    { id: 'text', icon: <FiType />, label: '텍스트', desc: '일반 텍스트를 작성합니다.', category: '기본' },
    { id: 'todo', icon: <FiCheckSquare />, label: '할 일 목록', desc: '체크박스 목록을 만듭니다.', category: '기본' },
    { id: 'image', icon: <FiImage />, label: '이미지', desc: '이미지나 미디어를 업로드합니다.', category: '미디어' },
    { id: 'jira', icon: <SiJira className="text-[#0052CC]" />, label: 'Jira 이슈 연결', desc: '기존 이슈를 검색하거나 새로 생성합니다.', category: '통합' },
  ];

  return (
    <div className="absolute top-48 left-16 w-80 bg-bg-base rounded shadow-floating border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
      
      <div className="flex items-center px-3 py-2 border-b border-gray-100 bg-gray-50/50">
        <FiSearch className="text-neutral-meta mr-2" />
        <input 
          type="text" 
          placeholder="명령어 검색..."
          className="flex-1 bg-transparent text-ui text-neutral-main outline-none placeholder:text-gray-400 font-mono"
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-72 overflow-y-auto p-2">
        <div className="text-[11px] font-bold text-neutral-meta uppercase mb-2 px-2 mt-1">
          제안됨 (Suggested)
        </div>
        
        <ul className="flex flex-col gap-1">
          {commands.map((cmd) => (
            <li 
              key={cmd.id}
              className="flex items-start gap-3 p-2 rounded-sm hover:bg-gray-100 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-white border border-gray-200 text-neutral-main group-hover:border-gray-300 shadow-sm shrink-0">
                {cmd.icon}
              </div>
              
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-ui font-semibold text-neutral-main">{cmd.label}</span>
                  <span className="text-[10px] bg-gray-200 text-neutral-meta px-1.5 py-0.5 rounded-sm">
                    {cmd.category}
                  </span>
                </div>
                <span className="text-[12px] text-neutral-meta truncate">{cmd.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
