import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProjectCreateModal({ isOpen, onClose, onSuccess }) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
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
          
          // Firestore에 데이터가 없으면 개발 환경에서는 더미 데이터 사용
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
      // 모달 닫힐 때 상태 초기화
      setProjectName('');
      setDescription('');
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

  // 검색어에 맞는 유저 필터링 (이미 선택된 유저 제외)
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
      e.preventDefault(); // 폼 제출 방지
      if (matchingUsers.length > 0 && isDropdownOpen) {
        handleSelectUser(matchingUsers[0]);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'projects'), {
        name: projectName,
        description: description,
        invitedUsers: selectedUsers.map(u => ({ id: u.id, username: u.username, email: u.email, profileImage: u.profileImage || null })),
        createdAt: serverTimestamp(),
        createdBy: '관리자',
        status: '활성'
      });

      setIsLoading(false);
      onSuccess(projectName);
    } catch (err) {
      console.error("Project Creation Error:", err);
      if (import.meta.env.DEV) {
        setIsLoading(false);
        onSuccess(projectName);
      } else {
        setError('프로젝트 생성 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-floating w-full max-w-md overflow-visible flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h2 className="text-lg font-bold text-neutral-main">새 프로젝트 생성</h2>
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
            <div>
              <label className="block text-[13px] font-semibold text-neutral-main mb-1.5">
                프로젝트 이름 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: KIVO 리뉴얼 프로젝트"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-ui transition-colors bg-white"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-neutral-main mb-1.5">
                프로젝트 설명 <span className="text-neutral-meta font-normal">(선택)</span>
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트의 목적이나 간략한 설명을 적어주세요."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-ui transition-colors resize-none bg-white"
              />
            </div>

            {/* 사용자 초대 (실시간 검색) 영역 */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-[13px] font-semibold text-neutral-main mb-1.5">
                사용자 초대 <span className="text-neutral-meta font-normal">(선택)</span>
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
              />
              
              {/* 드롭다운 검색 결과 */}
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
              
              <p className="mt-1.5 text-[12px] text-neutral-meta leading-snug">
                초대된 사용자는 프로젝트 생성 즉시 함께 참여할 수 있습니다. <br/>
                (지금 초대하지 않아도 추후에 언제든 개별적으로 초대할 수 있습니다.)
              </p>

              {/* 선택된 사용자 칩 목록 */}
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
              disabled={isLoading}
              className="px-5 py-2 bg-primary hover:bg-blue-700 text-white rounded-sm font-bold transition-colors text-[14px] flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? '생성 중...' : <><FiCheck size={16} /> 생성하기</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
