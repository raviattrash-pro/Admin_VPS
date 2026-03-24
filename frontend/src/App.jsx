import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  UserCog, 
  Wallet, 
  Package, 
  TrendingUp, 
  Home, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Download,
  ChevronRight
} from 'lucide-react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdmissionPage from './pages/AdmissionPage';
import FeeManagementPage from './pages/FeeManagementPage';
import StockPage from './pages/StockPage';
import StudentsListPage from './pages/StudentsListPage';
import StudentDashboard from './pages/StudentDashboard';
import PayFeesPage from './pages/PayFeesPage';
import ProfitLossPage from './pages/ProfitLossPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/UserManagementPage';
import './App.css';

import ThemeSwitcher from './components/ThemeSwitcher';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (role) {
    const isAdmin = user.role === 'ADMIN' || user.role === 'SYSTEM_ADMIN';
    if (role === 'ADMIN' && isAdmin) return children;
    if (user.role !== role) return <Navigate to={isAdmin ? '/admin' : '/student'} />;
  }
  return children;
}

function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
 
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
 
  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') setDeferredPrompt(null);
      });
    }
  };
 
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/admissions', icon: <GraduationCap size={18} />, label: 'Admissions' },
    { path: '/admin/students', icon: <Users size={18} />, label: 'Students' },
    { path: '/admin/users', icon: <UserCog size={18} />, label: 'User Management' },
    { path: '/admin/fees', icon: <Wallet size={18} />, label: 'Fee Management' },
    { path: '/admin/stock', icon: <Package size={18} />, label: 'Stock Management' },
    { path: '/admin/profit-loss', icon: <TrendingUp size={18} />, label: 'Profit / Loss' },
  ];

  const studentLinks = [
    { path: '/student', icon: <Home size={18} />, label: 'Dashboard' },
    { path: '/student/pay', icon: <CreditCard size={18} />, label: 'Pay Fees' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">V</div>
          <div>
            <h2>Vision Public School</h2>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Management Portal
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              end={link.path === '/admin' || link.path === '/student'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
              <ChevronRight className="chevron" size={14} />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-mini">
            <div className="avatar">{user?.fullName?.charAt(0)}</div>
            <div className="info">
              <div className="name">{user?.fullName}</div>
              <div className="role">{isAdmin ? 'Administrator' : 'Student'}</div>
            </div>
            <button className="action-btn logout-mini" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
          
          <ThemeSwitcher />
        </div>
      </aside>
      <header className="mobile-header">
        <div className="mobile-logo">
          <div className="logo-icon">V</div>
          <span>Vision Public School</span>
        </div>
        <div className="mobile-header-actions">
          {deferredPrompt && (
            <button className="mobile-action-btn install-pulse" onClick={installPWA} title="Download App">
              <Download size={18} />
            </button>
          )}
          <button className="mobile-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={useLocation().pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="mobile-nav">
        {links.slice(0, 4).map(link => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            end={link.path === '/admin' || link.path === '/student'}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
        <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN"><Layout><AdminDashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="ADMIN"><Layout><UserManagementPage /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/admissions" element={
            <ProtectedRoute role="ADMIN"><Layout><AdmissionPage /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute role="ADMIN"><Layout><StudentsListPage /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/fees" element={
            <ProtectedRoute role="ADMIN"><Layout><FeeManagementPage /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/stock" element={
            <ProtectedRoute role="ADMIN"><Layout><StockPage /></Layout></ProtectedRoute>
          } />
          <Route path="/admin/profit-loss" element={
            <ProtectedRoute role="ADMIN"><Layout><ProfitLossPage /></Layout></ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute role="STUDENT"><Layout><StudentDashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/student/pay" element={
            <ProtectedRoute role="STUDENT"><Layout><PayFeesPage /></Layout></ProtectedRoute>
          } />

          {/* Shared Profile Route */}
          <Route path="/profile" element={
            <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
