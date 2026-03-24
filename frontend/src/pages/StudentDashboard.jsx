import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, getMyFees, downloadReceipt, getActiveNotices, changePassword } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Clock, 
  Clipboard, 
  Bell, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle, 
  Download, 
  User,
  Calendar,
  MapPin,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Key
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await getMyProfile();
      setStudent(res.data.data);
    } catch (err) { console.error('Profile load error:', err); }

    try {
      const feesRes = await getMyFees();
      setFees(feesRes.data.data || []);
    } catch (err) { console.error('Fees load error:', err); }

    try {
      const noticeRes = await getActiveNotices();
      setNotices(noticeRes.data.data || []);
    } catch (err) { console.error('Notices load error:', err); }

    setLoading(false);
  };

  const handleDownload = async (id) => {
    try {
      const res = await downloadReceipt(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-VPS-${String(id).padStart(6, '0')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { alert('Receipt only available for verified payments'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setChangingPwd(true);
    try {
      await changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      setPwdMsg({ type: 'success', text: 'Credentials updated successfully' });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    }
    setChangingPwd(false);
  };

  const totalPaid = fees.filter(f => f.status === 'VERIFIED').reduce((s, f) => s + Number(f.amount), 0);
  const pendingCount = fees.filter(f => f.status === 'PENDING').length;

  if (loading) return <div className="loading-spinner" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Student Workspace</h1>
          <p>Welcome, <span className="accent-text">{student?.fullName || user?.fullName}</span></p>
        </motion.div>
      </header>

      {/* Stats Section */}
      <motion.div 
        className="stats-grid" 
        variants={container} 
        initial="hidden" 
        animate="show"
        style={{ marginBottom: '32px' }}
      >
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon purple"><GraduationCap size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{student?.classForAdmission || '—'}</div>
            <div className="stat-label">Academic Class</div>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon blue"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">₹{totalPaid.toLocaleString()}</div>
            <div className="stat-label">Total Contributions</div>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending Verifications</div>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{fees.length}</div>
            <div className="stat-label">Total History</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-layout-grid">
        {/* Left Column: Notices & Profile */}
        <div className="col-left">
          {/* Notice Board */}
          <section className="glass-static dashboard-section">
            <div className="section-header">
              <Bell size={20} className="accent-text" />
              <h3>Institution Notices</h3>
            </div>
            <div className="notice-scroller">
              {notices.length === 0 ? (
                <div className="empty-mini">
                  <Bell size={32} className="muted-icon" />
                  <p>No new updates at this time</p>
                </div>
              ) : (
                <div className="notice-cards-stack">
                  {notices.map(notice => (
                    <div key={notice.id} className={`notice-card-lux ${notice.priority === 'High' ? 'critical' : ''}`}>
                      <div className="card-top">
                        <span className="category-tag">{notice.category}</span>
                        <span className="date-tag">{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4>{notice.title}</h4>
                      <p>{notice.content}</p>
                      <div className="card-bottom">
                        <span className="author">By {notice.postedBy || 'Administration'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Profile Quick Info */}
          {student && (
            <section className="glass-static dashboard-section">
              <div className="section-header">
                <User size={20} className="accent-text" />
                <h3>Identity Profile</h3>
              </div>
              <div className="profile-details-lux">
                <div className="detail-row">
                  <IdRow icon={<ShieldCheck size={16}/>} label="ID Number" value={student.studentId} />
                  <IdRow icon={<Calendar size={16}/>} label="DOB" value={student.dateOfBirth} />
                </div>
                <div className="detail-row">
                  <IdRow icon={<User size={16}/>} label="Gender" value={student.gender} />
                  <IdRow icon={<TrendingUp size={16}/>} label="Admission" value={student.admissionType} />
                </div>
                <div className="full-row">
                  <IdRow icon={<MapPin size={16}/>} label="Permanent Address" value={student.parentAddress} />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Security & History */}
        <div className="col-right">
          {/* Change Password Card */}
          <section className="section-card-lux security-card">
            <div className="modal-header-lux">
              <Lock size={28} className="accent-text" />
              <h2>Security Settings</h2>
            </div>
            
            <AnimatePresence>
              {pwdMsg.text && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`alert-box ${pwdMsg.type}`}
                  style={{ marginBottom: '24px' }}
                >
                  {pwdMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
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
                <label>New Secure Key</label>
                <div className="input-with-icon">
                  <Lock size={18} className="accent-text" />
                  <input type="password" className="form-control" required minLength="4" value={pwdForm.newPassword} 
                    onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Minimum 4 characters" />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Identity Key</label>
                <div className="input-with-icon">
                  <ShieldCheck size={18} className="accent-text" />
                  <input type="password" className="form-control" required value={pwdForm.confirmPassword} 
                    onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Match new secure key" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary admit-btn" disabled={changingPwd} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                {changingPwd ? 'Synchronizing Cryptography...' : 'Confirm Identity Update'}
                <ArrowRight size={20} />
              </button>
            </form>
          </section>

          {/* Payment History */}
          <section className="glass-static dashboard-section">
            <div className="section-header">
              <Wallet size={20} className="accent-text" />
              <h3>Payment History</h3>
            </div>
            <div className="mini-history-list">
              {fees.length === 0 ? (
                <div className="empty-mini">No transaction records</div>
              ) : (
                fees.map(fee => (
                  <div key={fee.id} className="history-item-lux">
                    <div className="item-info">
                      <div className="type">{fee.feeType || 'General'}</div>
                      <div className="date">{new Date(fee.paidAt || fee.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="item-status">
                      <div className="amount">₹{fee.amount}</div>
                      <span className={`status-dot ${fee.status.toLowerCase()}`}>{fee.status}</span>
                    </div>
                    {fee.status === 'VERIFIED' && (
                      <button className="icon-btn-download" onClick={() => handleDownload(fee.id)}>
                        <Download size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function IdRow({ icon, label, value }) {
  return (
    <div className="id-row-item">
      <div className="icon-box">{icon}</div>
      <div className="text-box">
        <label>{label}</label>
        <span>{value || '—'}</span>
      </div>
    </div>
  );
}
