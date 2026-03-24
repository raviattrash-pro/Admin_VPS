import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, resetUserPassword } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle,
  UserCog,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  MoreVertical,
  Wallet
} from 'lucide-react';

const STAFF_ROLES = ['ADMIN', 'TEACHER', 'ACCOUNTANT', 'STAFF'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('TEACHER');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', role: 'TEACHER' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => { loadUsers(); }, [selectedRole]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(selectedRole);
      setUsers(res.data.data || []);
    } catch (err) { setMessage({ text: 'Access point restricted', type: 'error' }); }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      setMessage({ text: `New ${form.role} initialized successfully`, type: 'success' });
      setForm({ username: '', password: '', fullName: '', role: selectedRole });
      setShowModal(false);
      loadUsers();
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Provisioning failed', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently de-authorize this user?')) return;
    try {
      await deleteUser(id);
      setMessage({ text: 'User credentials purged', type: 'success' });
      loadUsers();
    } catch (err) { setMessage({ text: 'Action restricted', type: 'error' }); }
  };

  const handleReset = async (id) => {
    if (!confirm('Re-initialize access to default?')) return;
    try {
      await resetUserPassword(id);
      setMessage({ text: 'Access key reset to default', type: 'success' });
    } catch (err) { 
      setMessage({ text: err.response?.data?.message || 'Reset operation failed', type: 'error' }); 
    }
  };

  const canManageAdmins = currentUser?.role === 'SYSTEM_ADMIN';
  const availableRoles = canManageAdmins ? STAFF_ROLES : STAFF_ROLES.filter(r => r !== 'ADMIN');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Staff Directory</h1>
          <p>Access control and identity management for institutional roles</p>
        </motion.div>
        <button className="btn btn-primary" onClick={() => { setForm(p => ({ ...p, role: selectedRole })); setShowModal(true); }}>
          <UserPlus size={18} /> Provision User
        </button>
      </header>

      <AnimatePresence>
        {message.text && (
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className={`alert-box ${message.type}`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
            <button onClick={() => setMessage({ text: '', type: '' })} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="premium-tabs-bar">
        <div className="tabs nav-tabs-lux">
          {STAFF_ROLES.map(role => (
            <button 
              key={role} 
              className={`tab ${selectedRole === role ? 'active' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {role === 'ADMIN' ? <Shield size={16}/> : role === 'TEACHER' ? <GraduationCap size={16}/> : role === 'ACCOUNTANT' ? <Wallet size={16}/> : <Briefcase size={16}/>}
              {role}s
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="glass-static user-list-section"
      >
        <div className="section-header">
          <Users size={20} className="accent-text" />
          <h3>Active {selectedRole}s</h3>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>System Username</th>
                <th>Access Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4"><div className="loading-spinner-inline" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px' }} className="muted-text">No users found in this classification.</td></tr>
              ) : users.map(u => (
                <motion.tr key={u.id} variants={item}>
                  <td>
                    <div className="user-identity-cell">
                      <div className="avatar-lux">{u.fullName?.[0]}</div>
                      <div className="name-box">
                        <span className="full-name">{u.fullName}</span>
                        <span className="role-tag">{u.role}</span>
                      </div>
                    </div>
                  </td>
                  <td><code className="username-lux">@{u.username}</code></td>
                  <td>
                    <div className="status-pill verified">Authorized</div>
                  </td>
                  <td>
                    <div className="flex-actions justify-end">
                      <button className="btn-icon-lux ghost" onClick={() => handleReset(u.id)} title="Reset Access"><Key size={14} /></button>
                      <button className="btn-icon-lux danger" onClick={() => handleDelete(u.id)} title="Revoke Access"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal glass-static" onClick={e => e.stopPropagation()}>
            <div className="modal-header-lux">
              <UserPlus size={24} className="accent-text" />
              <h2>Provision New Account</h2>
            </div>
            <form onSubmit={handleCreate} className="lux-form">
              <div className="form-group">
                <label>Legal Full Name</label>
                <input className="form-control" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required placeholder="Verification Name" />
              </div>
              <div className="form-row-half">
                <div className="form-group">
                  <label>Service Role</label>
                  <select className="form-control" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>System Username</label>
                  <input className="form-control" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required placeholder="username" />
                </div>
              </div>
              <div className="form-group">
                <label>Temporary Access Key</label>
                <input type="password" className="form-control" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Secret entry key" />
              </div>
              <div className="modal-actions-lux">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Dismiss</button>
                <button type="submit" className="btn btn-primary">Authorize Account</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
