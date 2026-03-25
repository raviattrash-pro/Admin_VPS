import { useState, useEffect } from 'react';
import { getSystemHealth, getStudents, getAllFees, getStockItems, getAllNotices, createNotice, updateNotice, deleteNotice, getUploadUrl } from '../api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Megaphone,
  Cpu,
  Database,
  Cloud
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
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', priority: 'Medium', active: true });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const fetchSafe = async (fn, defaultVal = []) => {
        try {
          const res = await fn();
          return res.data.data || defaultVal;
        } catch (err) {
          console.error('Safe fetch failed:', err);
          return defaultVal;
        }
      };

      const [students, fees, stock, notices, health] = await Promise.all([
        fetchSafe(getStudents),
        fetchSafe(getAllFees),
        fetchSafe(getStockItems),
        fetchSafe(getAllNotices),
        fetchSafe(getSystemHealth, { status: 'UNKNOWN' })
      ]);

      const pending = fees.filter(f => f.status === 'PENDING').length;
      
      return {
        stats: { students: students.length, fees: fees.length, pending, stockItems: stock.length },
        recentStudents: students.slice(-10).reverse(),
        notices: notices,
        health: health
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const noticeMutation = useMutation({
    mutationFn: (data) => editItem ? updateNotice(editItem.id, data) : createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setShowModal(false);
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  if (isLoading) return <div className="full-page-loader" />;

  const { stats, recentStudents, notices, health } = dashboardData || { 
    stats: {}, 
    recentStudents: [], 
    notices: [], 
    health: { status: 'LOADING', database: {}, storage: {}, resources: {} } 
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
      await noticeMutation.mutateAsync(form);
    } catch (err) { alert(err.response?.data?.message || 'Error saving notice'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try { 
      await deleteNoticeMutation.mutateAsync(id); 
    } catch (err) { alert('Failed to delete'); }
  };

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
          
          <div className="student-list-compact">
            {recentStudents.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="muted-icon" />
                <p>No recent records</p>
              </div>
            ) : (
              recentStudents.map((s) => (
                <motion.div 
                  key={s.id} 
                  className="student-compact-item glass"
                  whileHover={{ x: 5, background: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div className="avatar-mini">
                    {s.photographPath ? (
                      <img 
                        src={getUploadUrl(s.photographPath)} 
                        alt={s.fullName} 
                      />
                    ) : (
                      s.fullName?.[0] || '?'
                    )}
                  </div>
                  <span className="student-name">{s.fullName}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div 
          className="glass-static section-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} className="accent-color" /> System Performance</h3>
            <span className={`badge ${health.status === 'UP' ? 'badge-success' : 'badge-warning'}`}>
              {health.status === 'UP' ? 'Optimal' : health.status}
            </span>
          </div>
          
          <div className="system-metrics">
            <div className="metric-item">
              <div className="metric-header">
                <Database size={16} />
                <span>Database Engine</span>
              </div>
              <div className={`metric-status ${health.database?.status === 'CONNECTED' ? 'text-success' : 'text-danger'}`}>
                {health.database?.status || 'Unknown'}
              </div>
            </div>
            
            <div className="metric-item">
              <div className="metric-header">
                <Cloud size={16} />
                <span>Storage System</span>
              </div>
              <div className="metric-status text-info">
                {health.storage?.provider || 'Local Storage'}
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-header">
                <Cpu size={16} />
                <span>Memory Utilization</span>
              </div>
              <div className="metric-progress-wrapper">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(health.resources?.usedMemoryMB / health.resources?.totalMemoryMB) * 100}%` }}
                  ></div>
                </div>
                <span>{health.resources?.usedMemoryMB}MB / {health.resources?.totalMemoryMB}MB</span>
              </div>
            </div>
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
