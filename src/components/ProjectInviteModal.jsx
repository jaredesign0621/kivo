import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProjectInviteModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 사용자 초대 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 모달 열릴 때 유저 목록 불러오기
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'users'));
          let usersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          if (usersData.length === 0 && import.meta.env.DEV) {
            usersData = [
              { id: '1', username: 'admin', email: 'admin@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=11' },
              { id: '2', username: 'developer1', email: 'dev1@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=12' },
              { id: '3', username: 'designer1', email: 'design@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=5' },
              { id: '4', username: 'kivo_ceo', email: 'ceo@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=15' },
              { id: '5', username: 'alex_kim', email: 'alex@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=33' }
            ];
          }
          
          setAllUsers(usersData);
        } catch (err) {
          console.error("Error fetching users:", err);
          if (import.meta.env.DEV) {
            setAllUsers([
              { id: '1', username: 'admin', email: 'admin@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=11' },
              { id: '2', username: 'developer1', email: 'dev1@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=12' },
              { id: '3', username: 'designer1', email: 'design@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=5' },
              { id: '4', username: 'kivo_ceo', email: 'ceo@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=15' },
              { id: '5', username: 'alex_kim', email: 'alex@kivo.com', profileImage: 'https://i.pravatar.cc/100?img=33' }
            ]);
          }
        }
      };
      fetchUsers();
    } else {
      setSearchQuery('');
      setSelectedUsers([]);
      setError('');
    }
  }, [isOpen]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matchingUsers = allUsers.filter(user => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    const isSelected = selectedUsers.some(su => su.id === user.id);
    if (isSelected) return false;
    
    return (
      (user.username && user.username.toLowerCase().includes(query)) || 
      (user.email && user.email.toLowerCase().includes(query))
    );
  });

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingUsers.length > 0 && isDropdownOpen) {
        handleSelectUser(matchingUsers[0]);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setError('초대할 사용자를 먼저 검색하고 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 실제 프로젝트 문서(ID)를 찾아서 updateDoc을 해야 하지만,
      // 현재 프로젝트 구조상 시뮬레이션으로 진행
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsLoading(false);
      alert(`${selectedUsers.length}명의 사용자를 성공적으로 초대했습니다!`);
      onClose();
    } catch (err) {
      console.error("Invite Error:", err);
      setError('사용자 초대 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-floating w-full max-w-md overflow-visible flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-neutral-main">프로젝트 멤버 초대</h2>
            <p className="text-[12px] text-neutral-meta mt-0.5">새로운 팀원을 프로젝트에 추가합니다.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-neutral-main transition-colors">
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-sm text-[13px] flex items-center gap-2">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-[13px] font-semibold text-neutral-main mb-1.5">
                사용자 검색
              </label>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="사용자 아이디 또는 이메일 검색"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-ui transition-colors bg-white"
                autoFocus
              />
              
              {isDropdownOpen && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-floating max-h-48 overflow-y-auto z-10">
                  {matchingUsers.length > 0 ? (
                    matchingUsers.map(user => (
                      <div 
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-none"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                              {(user.username || 'U')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-neutral-main">{user.username}</span>
                          <span className="text-[11px] text-neutral-meta">{user.email}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-[13px] text-neutral-meta">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}
              
              {selectedUsers.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1.5 pr-3 py-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-white shrink-0 border border-gray-200">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-[10px]">
                            {(user.username || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-[12px] font-medium text-neutral-main">{user.username}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-neutral-meta hover:bg-gray-100 rounded-sm font-medium transition-colors text-[14px]"
            >
              취소
            </button>
            <button 
              type="submit" 
              disabled={isLoading || selectedUsers.length === 0}
              className="px-5 py-2 bg-primary hover:bg-blue-700 text-white rounded-sm font-bold transition-colors text-[14px] flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? '초대 중...' : <><FiCheck size={16} /> 초대하기</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
