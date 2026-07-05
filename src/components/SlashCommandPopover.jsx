import React, { useState, useEffect, useRef } from 'react';
import { FiType, FiImage, FiCheckSquare, FiSearch } from 'react-icons/fi';
import { SiJira } from 'react-icons/si';

export default function SlashCommandPopover({ isOpen, coords, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const popoverRef = useRef(null);

  const commands = [
    { id: 'text', icon: <FiType />, label: '텍스트', desc: '일반 텍스트를 작성합니다.', category: '기본' },
    { id: 'todo', icon: <FiCheckSquare />, label: '할 일 목록', desc: '체크박스 목록을 만듭니다.', category: '기본' },
    { id: 'image', icon: <FiImage />, label: '이미지', desc: '이미지나 미디어를 업로드합니다.', category: '미디어' },
    { id: 'jira', icon: <SiJira className="text-[#0052CC]" />, label: 'Jira 이슈 연결', desc: '기존 이슈를 검색하거나 새로 생성합니다.', category: '통합' },
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onSelect, onClose]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !coords) return null;

  return (
    <div 
      ref={popoverRef}
      className="fixed w-80 bg-bg-base rounded shadow-floating border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: coords.top + 24, left: coords.left }}
    >
      
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
          {filteredCommands.length > 0 ? filteredCommands.map((cmd, index) => (
            <li 
              key={cmd.id}
              onClick={() => onSelect(cmd)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-start gap-3 p-2 rounded-sm cursor-pointer transition-colors group ${
                selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`}
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
          )) : (
            <div className="py-8 text-center text-neutral-meta text-sm">
              일치하는 명령어가 없습니다.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
