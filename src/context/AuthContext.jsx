import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, removeToken } from '../services/api';



const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());


  const refreshUser = () => {
    const currentUser = getUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
    refreshUser,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
