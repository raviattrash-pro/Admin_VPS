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
    if (token && role) {
      setUser({ token, role, fullName, userId: parseInt(userId) });
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('userId', data.userId);
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, isAdmin: user?.role === 'ADMIN' || user?.role === 'SYSTEM_ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};
