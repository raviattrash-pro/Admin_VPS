import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    const userId = localStorage.getItem('userId');
    const photographPath = localStorage.getItem('photographPath');
    if (token && role) {
      setUser({ token, role, fullName, userId: parseInt(userId), photographPath });
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('photographPath', data.photographPath || '');
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const refreshUser = (newData) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    if (newData.fullName) localStorage.setItem('fullName', newData.fullName);
    if (newData.photographPath !== undefined) localStorage.setItem('photographPath', newData.photographPath || '');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginUser, 
      logout,
      refreshUser,
      isAdmin: user?.role && ['ADMIN', 'SYSTEM_ADMIN', 'TEACHER', 'ACCOUNTANT', 'STAFF'].includes(user.role) 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
