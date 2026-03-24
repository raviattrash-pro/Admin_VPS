import { useState, useEffect } from 'react';
import { getAllAdmins, createAdmin, deleteAdmin, resetAdminPassword } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Key, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Fingerprint,
  UserCircle
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', fullName: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => { loadAdmins(); }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins();
      setAdmins(res.data.data || []);
    } catch (err) { setMessage({ text: 'Access point restricted', type: 'error' }); }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(form);
      setMessage({ text: 'Administrative portal initialized for new user', type: 'success' });
      setForm({ username: '', password: '', fullName: '' });
      setShowModal(false);
      loadAdmins();
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Provisioning failed', type: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently de-authorize this admin?')) return;
    try {
      await deleteAdmin(id);
      setMessage({ text: 'Admin credentials purged from core', type: 'success' });
      loadAdmins();
    } catch (err) { setMessage({ text: 'Privilege restriction', type: 'error' }); }
  };

  const handleReset = async (id) => {
    if (!confirm('Re-initialize administrative access?')) return;
    try {
      await resetAdminPassword(id);
      setMessage({ text: 'Administrative access key reset', type: 'success' });
    } catch (err) { setMessage({ text: 'Reset operation failed', type: 'error' }); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>System Governance</h1>
          <p>Superior access management and administrative oversight</p>
        </motion.div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Provision Admin
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

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="glass-static user-list-section"
      >
        <div className="section-header">
          <ShieldCheck size={20} className="accent-text" />
          <h3>Executive Directory</h3>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Administrative Identity</th>
                <th>System Alias</th>
                <th>Security Clearance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4"><div className="loading-spinner-inline" /></td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px' }} className="muted-text">No high-level administrative accounts found.</td></tr>
              ) : admins.map(admin => (
                <motion.tr key={admin.id} variants={item}>
                  <td>
                    <div className="user-identity-cell">
                      <div className="avatar-lux gold-glow">{admin.fullName?.[0]}</div>
                      <div className="name-box">
                        <span className="full-name">{admin.fullName}</span>
                        <span className="role-tag luxury">EXECUTIVE</span>
                      </div>
                    </div>
                  </td>
                  <td><code className="username-lux">@{admin.username}</code></td>
                  <td>
                    <div className="status-pill premium">SYSTEM_ADMIN</div>
                  </td>
                  <td>
                    <div className="flex-actions justify-end">
                      <button className="btn-icon-lux ghost" onClick={() => handleReset(admin.id)} title="Reset Security Key"><Key size={14} /></button>
                      <button className="btn-icon-lux danger" onClick={() => handleDelete(admin.id)} title="Revoke Privilege"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal glass-static" onClick={e => e.stopPropagation()}>
            <div className="modal-header-lux">
              <Shield size={24} className="accent-text" />
              <h2>Authorize Executive</h2>
            </div>
            <form onSubmit={handleCreate} className="lux-form">
              <div className="form-group">
                <label>Official Full Name</label>
                <input className="form-control" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required placeholder="Legal Name" />
              </div>
              <div className="form-row-half">
                <div className="form-group">
                  <label>Service Tier</label>
                  <select className="form-control" disabled value="ADMIN">
                    <option value="ADMIN">ADMINISTRATOR</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>System Alias</label>
                  <input className="form-control" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required placeholder="alias_id" />
                </div>
              </div>
              <div className="form-group">
                <label>Primary Security Key</label>
                <div className="input-with-icon">
                  <Lock size={16} className="muted-icon" />
                  <input type="password" className="form-control" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required placeholder="Required" />
                </div>
              </div>
              <div className="modal-actions-lux">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Dismiss</button>
                <button type="submit" className="btn btn-primary luxury">Authorize Portal Access</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
