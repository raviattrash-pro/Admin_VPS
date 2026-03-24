import { useState, useEffect } from 'react';
import { getStudents, getAllFees, getStockItems, getAllNotices, createNotice, updateNotice, deleteNotice } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Wallet, 
  Clock, 
  Package, 
  Plus, 
  Bell, 
  Trash2, 
  Edit3, 
  UserPlus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  PlusCircle,
  Megaphone
} from 'lucide-react';

const NOTICE_CATEGORIES = ['General', 'Exam', 'Holiday', 'Event', 'Fee', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, fees: 0, pending: 0, stockItems: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notice Modal State
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', priority: 'Medium', active: true });

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [studentsRes, feesRes, stockRes, noticesRes] = await Promise.all([
        getStudents(), getAllFees(), getStockItems(), getAllNotices()
      ]);
      const students = studentsRes.data.data || [];
      const fees = feesRes.data.data || [];
      const stock = stockRes.data.data || [];
      const pending = fees.filter(f => f.status === 'PENDING').length;

      setStats({
        students: students.length,
        fees: fees.length,
        pending,
        stockItems: stock.length
      });
      setRecentStudents(students.slice(-5).reverse());
      setNotices(noticesRes.data.data || []);
    } catch (err) { console.error('Dashboard load error:', err); }
    setLoading(false);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', content: '', category: 'General', priority: 'Medium', active: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title, content: item.content, category: item.category,
      priority: item.priority, active: item.active
    });
    setShowModal(true);
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateNotice(editItem.id, form);
      } else {
        await createNotice(form);
      }
      setShowModal(false);
      loadDashboard();
    } catch (err) { alert(err.response?.data?.message || 'Error saving notice'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try { await deleteNotice(id); loadDashboard(); } catch (err) { alert('Failed to delete'); }
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Admin Overview</h1>
          <p>Real-time analytics and management control</p>
        </motion.div>
        <motion.div 
          className="header-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button className="btn btn-primary" onClick={openAdd}>
            <PlusCircle size={18} /> New Notice
          </button>
        </motion.div>
      </header>

      <motion.div 
        className="stats-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon purple"><Users size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{stats.students}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon green"><Wallet size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{stats.fees}</div>
            <div className="stat-label">Fee Records</div>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Verifications</div>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon red"><Package size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{stats.stockItems}</div>
            <div className="stat-label">Inventory Items</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-sections">
        {/* Notice Board */}
        <motion.div 
          className="glass-static section-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="section-header">
            <h3><Megaphone size={20} className="accent-color" /> Recent Notices</h3>
            <span className="badge badge-info">{notices.length} Total</span>
          </div>
          
          <div className="scroll-area">
            {notices.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} className="muted-icon" />
                <p>No active notices at the moment</p>
              </div>
            ) : (
              <div className="notice-list">
                {notices.map(notice => (
                  <motion.div 
                    key={notice.id} 
                    className="notice-item glass"
                    whileHover={{ scale: 1.01 }}
                    style={{ borderLeft: notice.priority === 'High' ? '4px solid var(--danger)' : '4px solid var(--accent)' }}
                  >
                    <div className="notice-meta">
                      <span className="notice-category">{notice.category}</span>
                      <div className="notice-actions">
                        <button className="icon-btn" onClick={() => openEdit(notice)}><Edit3 size={14} /></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(notice.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <h4>{notice.title}</h4>
                    <p>{notice.content}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Students */}
        <motion.div 
          className="glass-static section-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="section-header">
            <h3><UserPlus size={20} className="accent-color" /> Latest Admissions</h3>
          </div>
          
          <div className="student-list">
            {recentStudents.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="muted-icon" />
                <p>No recent admissions recorded</p>
              </div>
            ) : (
              recentStudents.map((s) => (
                <motion.div 
                  key={s.id} 
                  className="student-card glass"
                  whileHover={{ x: 5 }}
                >
                  <div className="student-avatar-wrapper">
                    <div className="avatar">{s.fullName?.[0] || '?'}</div>
                  </div>
                  <div className="student-details">
                    <h4>{s.fullName}</h4>
                    <div className="meta">
                      <span>{s.classForAdmission || 'N/A'}</span>
                      <span className="dot">•</span>
                      <span>ID: {s.studentId || 'New'}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="muted-icon" />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Notice Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal glass-static"
              style={{ overflow: 'hidden' }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editItem ? <Edit3 size={20}/> : <Plus size={20}/>} {editItem ? 'Edit Notice' : 'Post New Notice'}</h2>
              </div>
              <form onSubmit={handleNoticeSubmit} className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Heading for the notice..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {NOTICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select className="form-control" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Notice Content</label>
                  <textarea className="form-control" rows="4" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required placeholder="Provide details here..." />
                </div>
                <div className="form-check">
                  <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                  <label htmlFor="active">Visible to all students</label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editItem ? 'Save Changes' : 'Confirm & Post'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
