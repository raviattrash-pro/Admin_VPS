import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Key, 
  Lock, 
  Calendar, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  UserCircle,
  Fingerprint,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setChangingPwd(true);
    try {
      await changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      setPwdMsg({ type: 'success', text: 'Access key updated successfully' });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Access synchronization failed' });
    }
    setChangingPwd(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-container fade-in">
      <header className="page-header center-header">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1>Account Identity</h1>
          <p>Personal credentials and security management</p>
        </motion.div>
      </header>

      <div className="profile-grid-lux">
        {/* Identity Card */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="glass-static profile-card-lux"
        >
          <div className="avatar-large-lux">
            <UserCircle size={80} className="accent-text" />
            <div className="status-indicator online"></div>
          </div>
          <div className="profile-info-lux">
            <h2 className="full-name">{user?.fullName}</h2>
            <div className="role-badge-lux">
              <ShieldCheck size={14} />
              <span>{user?.role}</span>
            </div>
            <div className="id-tag-lux">
              <Fingerprint size={14} />
              <span>@{user?.username}</span>
            </div>
          </div>
          
          <div className="info-grid-lux">
            <div className="info-item-lux">
              <label>Service Hub</label>
              <span>Vision Public School</span>
            </div>
            <div className="info-item-lux">
              <label>Account Status</label>
              <span className="success-text">Authorized</span>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="section-card-lux security-card-lux"
        >
          <div className="modal-header-lux">
            <Lock size={28} className="accent-text" />
            <h2>Security & Access</h2>
          </div>
          
          <AnimatePresence>
            {pwdMsg.text && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                className={`alert-box ${pwdMsg.type}`}
                style={{ marginBottom: '24px' }}
              >
                {pwdMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {pwdMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handlePasswordChange} className="lux-form">
            <div className="form-group">
              <label>Current Security Key</label>
              <div className="input-with-icon">
                <Key size={18} className="accent-text" />
                <input type="password" className="form-control" required value={pwdForm.currentPassword} 
                  onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Verification Required" />
              </div>
            </div>
            <div className="form-group">
              <label>New Security Key</label>
              <div className="input-with-icon">
                <Lock size={18} className="accent-text" />
                <input type="password" className="form-control" required minLength="4" value={pwdForm.newPassword} 
                  onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Minimum 4 characters" />
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Identity Key</label>
              <div className="input-with-icon">
                <Shield size={18} className="accent-text" />
                <input type="password" className="form-control" required value={pwdForm.confirmPassword} 
                  onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter new key" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary admit-btn" disabled={changingPwd} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
              {changingPwd ? 'Synchronizing Cryptography...' : 'Confirm Authentication Update'}
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
