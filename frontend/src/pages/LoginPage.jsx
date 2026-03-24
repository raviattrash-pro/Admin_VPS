import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/api';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ username, password });
      const data = res.data.data;
      loginUser(data);
      navigate(data.role === 'ADMIN' || data.role === 'SYSTEM_ADMIN' ? '/admin' : '/student');
    } catch (err) {
      if (!err.response) {
        setError('Network error: Unable to connect to the server. Please check your CORS settings or internet connection.');
      } else {
        setError(err.response.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <motion.div 
        className="login-card glass"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="login-header">
          <motion.div 
            className="logo-icon large"
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            V
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Vision Public School
          </motion.h1>
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Institutional Management Portal
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className="login-error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ShieldCheck size={16} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><User size={12} style={{ marginRight: '6px' }} /> Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label><Lock size={12} style={{ marginRight: '6px' }} /> Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="btn btn-primary login-btn" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex-center"><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span> Verifying...</span>
            ) : (
              <span className="flex-center">Secure Sign In <ArrowRight size={18} style={{ marginLeft: '10px' }} /></span>
            )}
          </motion.button>
        </form>
        
        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Protected by end-to-end encryption</p>
          <span>v2.4.0 • Enterprise Edition</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
