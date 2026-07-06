import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCheck, FiCamera, FiLoader } from 'react-icons/fi';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ConfirmModal from './ConfirmModal';

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    email: '',
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  const [idChecked, setIdChecked] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showAlert = (title, message, onConfirm = null) => {
    setAlertConfig({ isOpen: true, title, message, onConfirm });
  };
  const [profileFile, setProfileFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // 모달이 열리고 닫힐 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 아이디가 변경되면 중복확인 초기화
    if (name === 'id') setIdChecked(false);
  };

  const handleAgreementChange = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllAgree = () => {
    const isAllChecked = agreements.terms && agreements.privacy && agreements.marketing;
    setAgreements({
      terms: !isAllChecked,
      privacy: !isAllChecked,
      marketing: !isAllChecked,
    });
  };

  const checkIdDuplicate = async () => {
    if (!formData.id.trim()) {
      showAlert('알림', '아이디를 입력해주세요.');
      return;
    }
    
    try {
      const docRef = doc(db, 'users', formData.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        showAlert('알림', '이미 사용중인 아이디입니다.');
        setIdChecked(false);
      } else {
        showAlert('알림', '사용 가능한 아이디입니다.');
        setIdChecked(true);
      }
    } catch (error) {
      console.error('Error checking duplicate ID:', error);
      showAlert('오류', '중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idChecked) {
      showAlert('알림', '아이디 중복확인을 진행해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      showAlert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!agreements.terms || !agreements.privacy) {
      showAlert('알림', '필수 약관에 동의해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. 프로필 이미지 업로드 (선택사항)
      let profileUrl = null;
      if (profileFile) {
        const storageRef = ref(storage, `profiles/${formData.id}_${Date.now()}`);
        await uploadBytes(storageRef, profileFile);
        profileUrl = await getDownloadURL(storageRef);
      }

      // 2. Firebase Auth 가입 (가상 이메일 사용)
      const virtualEmail = `${formData.id}@kivo.com`;
      await createUserWithEmailAndPassword(auth, virtualEmail, formData.password);

      // 3. Firestore 사용자 데이터 저장
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      await setDoc(doc(db, 'users', formData.id), {
        id: formData.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        profileUrl: profileUrl,
        marketing: agreements.marketing ? 'Y' : 'N',
        date: formattedDate,
        status: '활성'
      });

      showAlert('알림', '회원가입이 완료되었습니다!', onClose);
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.code === 'auth/email-already-in-use') {
         showAlert('알림', '이미 가입된 아이디입니다.');
      } else {
         showAlert('오류', '회원가입 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 일치 여부 확인
  const isPasswordMatch = formData.passwordConfirm.length > 0 && formData.password === formData.passwordConfirm;
  const isPasswordMismatch = formData.passwordConfirm.length > 0 && formData.password !== formData.passwordConfirm;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-body">
      {/* 딤드 영역 클릭 시 모달 닫기 방지 (원하면 onClick={onClose} 추가 가능) */}
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-[500px] w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-neutral-main">회원가입</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-neutral-main transition-colors p-1"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="signup-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center mb-2">
              <div 
                className="relative w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:bg-gray-200 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : formData.name ? (
                  <span className="text-2xl font-bold text-gray-500">{formData.name.charAt(0)}</span>
                ) : (
                  <FiCamera size={24} className="text-gray-400 group-hover:text-gray-500 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera size={20} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              <span className="text-[12px] text-neutral-meta mt-2">프로필 사진 (선택)</span>
            </div>

            {/* 아이디 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">아이디 <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="영문 소문자, 숫자 4~20자"
                  className={`flex-1 h-10 px-3 rounded-sm border outline-none transition-all text-body ${
                    formData.id && !/^[a-z0-9]{4,20}$/.test(formData.id)
                      ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                      : 'border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                  }`}
                  required
                  pattern="^[a-z0-9]{4,20}$"
                  title="4~20자의 영문 소문자, 숫자만 사용 가능합니다"
                />
                <button 
                  type="button"
                  onClick={checkIdDuplicate}
                  className={`px-4 h-10 rounded-sm font-medium transition-colors ${
                    idChecked ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-neutral-main hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {idChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
              {formData.id && !/^[a-z0-9]{4,20}$/.test(formData.id) && (
                <p className="text-[13px] text-red-500 mt-0.5">아이디는 4~20자의 영문 소문자, 숫자만 사용 가능합니다.</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">비밀번호 <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="영문, 숫자, 특수문자 조합 8~20자"
                className={`w-full h-10 px-3 rounded-sm border outline-none transition-all text-body ${
                  formData.password && !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/.test(formData.password)
                    ? 'border-red-500 bg-red-50 focus:ring-red-500'
                    : 'border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
                required
                pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$"
                title="8~20자의 영문, 숫자, 특수문자를 포함해야 합니다"
                maxLength={20}
              />
              {formData.password && !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/.test(formData.password) && (
                <p className="text-[13px] text-red-500 mt-0.5">비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">비밀번호 확인 <span className="text-red-500">*</span></label>
              <input 
                type="password" 
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 다시 입력"
                className={`w-full h-10 px-3 rounded-sm border outline-none transition-all text-body ${
                  isPasswordMismatch 
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : isPasswordMatch 
                      ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-500' 
                      : 'border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
                required
              />
              {isPasswordMismatch && <p className="text-[13px] text-red-500 mt-0.5">비밀번호가 일치하지 않습니다.</p>}
              {isPasswordMatch && <p className="text-[13px] text-green-600 mt-0.5">비밀번호가 일치합니다.</p>}
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">이름 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="실명 입력"
                className="w-full h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body"
                required
              />
            </div>

            {/* 연락처 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">연락처 <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="숫자만 입력 (예: 01012345678)"
                className="w-full h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body"
                required
              />
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-ui font-semibold text-neutral-main">이메일 <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@kivo.com"
                className="w-full h-10 px-3 rounded-sm border border-gray-300 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body"
                required
              />
            </div>

            {/* 약관 동의 */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3">
              <div 
                className="flex items-center gap-2 cursor-pointer pb-2 border-b border-gray-100"
                onClick={handleAllAgree}
              >
                <Checkbox checked={agreements.terms && agreements.privacy && agreements.marketing} />
                <span className="font-semibold text-neutral-main select-none">모두 동의합니다.</span>
              </div>

              <div className="flex items-center justify-between group">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleAgreementChange('terms')}
                >
                  <Checkbox checked={agreements.terms} />
                  <span className="text-ui text-neutral-main group-hover:text-primary transition-colors select-none">(필수) 이용약관 동의</span>
                </div>
                <button type="button" className="text-[13px] text-neutral-meta underline hover:text-neutral-main">내용보기</button>
              </div>

              <div className="flex items-center justify-between group">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleAgreementChange('privacy')}
                >
                  <Checkbox checked={agreements.privacy} />
                  <span className="text-ui text-neutral-main group-hover:text-primary transition-colors select-none">(필수) 개인정보 수집 및 이용 동의</span>
                </div>
                <button type="button" className="text-[13px] text-neutral-meta underline hover:text-neutral-main">내용보기</button>
              </div>

              <div className="flex items-center justify-between group">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleAgreementChange('marketing')}
                >
                  <Checkbox checked={agreements.marketing} />
                  <span className="text-ui text-neutral-main group-hover:text-primary transition-colors select-none">(선택) 마케팅 정보 수신 동의</span>
                </div>
                <button type="button" className="text-[13px] text-neutral-meta underline hover:text-neutral-main">내용보기</button>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 shrink-0 bg-gray-50 rounded-b-lg">
          <button 
            type="submit"
            form="signup-form"
            className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-sm transition-colors shadow-sm text-lg"
          >
            회원가입 하기
          </button>
        </div>

      </div>

      <ConfirmModal 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="확인"
        showCancel={false}
        onConfirm={() => {
          setAlertConfig(prev => ({ ...prev, isOpen: false }));
          if (alertConfig.onConfirm) alertConfig.onConfirm();
        }}
      />
    </div>
  );
}

// Custom Checkbox Component (Pure Visual)
function Checkbox({ checked }) {
  return (
    <div className={`flex items-center justify-center w-5 h-5 border-2 rounded-sm transition-all shrink-0 ${checked ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
      <FiCheck className={`text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} size={14} strokeWidth={3} />
    </div>
  );
}
