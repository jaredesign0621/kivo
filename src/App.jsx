import React, { useState } from 'react';
import WorkspaceLayout from './components/WorkspaceLayout';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';

function App() {
  const [userRole, setUserRole] = useState(null); // 'admin', 'user', or null

  return (
    <>
      {userRole === 'admin' ? (
        <AdminLayout />
      ) : userRole === 'user' ? (
        <WorkspaceLayout />
      ) : (
        <Login onLogin={(role) => setUserRole(role)} />
      )}
    </>
  );
}

export default App;
