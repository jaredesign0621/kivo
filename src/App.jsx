import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import WorkspaceLayout from './components/WorkspaceLayout';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'user', or null
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 최고 관리자 계정 또는 개발 환경의 로컬 테스트 계정 유지
    const storedRole = localStorage.getItem('kivo_local_role');
    if (storedRole === 'admin' || (import.meta.env.DEV && storedRole === 'user')) {
      setUserRole(storedRole);
      setIsChecking(false);
      return;
    }

    // 파이어베이스 인증 상태 리스너 (새로고침 시 로그인 유지)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserRole('user');
      } else {
        // DEV 환경이 아니거나, 파이어베이스에 로그인 안된 경우
        if (!import.meta.env.DEV || !localStorage.getItem('kivo_local_role')) {
          setUserRole(null);
        }
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    
    // 최고 관리자는 로컬/운영 무관하게 로컬스토리지에 저장하여 새로고침 시 유지
    if (role === 'admin') {
      localStorage.setItem('kivo_local_role', 'admin');
      navigate('/admin/dashboard');
    } 
    // 개발 환경에서는 테스트 계정도 유지
    else if (import.meta.env.DEV && role === 'user') {
      localStorage.setItem('kivo_local_role', 'user');
      navigate('/workspace/ideas');
    } else {
      navigate('/workspace/ideas');
    }
  };

  if (isChecking) {
    return <div className="h-screen w-screen bg-bg-panel flex items-center justify-center text-neutral-meta font-medium">인증 정보를 확인 중입니다...</div>;
  }

  // 권한 기반 라우트 보호 컴포넌트
  const ProtectedRoute = ({ allowedRole, children }) => {
    if (!userRole) return <Navigate to="/login" replace />;
    if (userRole !== allowedRole) {
       return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/workspace/ideas'} replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={userRole ? <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/workspace/ideas'} replace /> : <Login onLogin={handleLogin} />} />
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      } />
      <Route path="/workspace/*" element={
        <ProtectedRoute allowedRole="user">
          <WorkspaceLayout />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to={userRole ? (userRole === 'admin' ? '/admin/dashboard' : '/workspace/ideas') : "/login"} replace />} />
    </Routes>
  );
}

export default App;
