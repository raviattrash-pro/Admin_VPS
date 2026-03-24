import { useQuery } from '@tanstack/react-query';
import { getActiveNotices } from '../api/api';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, User, Clock, Bell } from 'lucide-react';

export default function NoticesPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: getActiveNotices,
  });

  const notices = res?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '60vh' }}>
        <div className="loading-spinner-lux" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Notice Board</h1>
          <p>Important updates and announcements from the institution</p>
        </motion.div>
        <div className="header-icon-lux">
          <Bell size={24} className="accent-text" />
        </div>
      </header>

      <div className="notices-grid-lux" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {notices.length === 0 ? (
          <div className="glass-static" style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center' }}>
            <Megaphone size={48} className="muted-text" style={{ marginBottom: '20px', opacity: 0.3 }} />
            <h3 className="muted-text">No active notices at this time</h3>
            <p className="muted-text">Check back later for new announcements.</p>
          </div>
        ) : (
          notices.map((notice, idx) => (
            <motion.div 
              key={notice.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-static notice-card-lux"
              style={{ 
                padding: '24px', 
                position: 'relative', 
                overflow: 'hidden',
                borderLeft: notice.priority === 'HIGH' ? '4px solid #ff4757' : '1px solid var(--glass-border)'
              }}
            >
              <div className="notice-meta" style={{ display: 'flex', gap: '15px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14}/> {new Date(notice.createdAt).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14}/> {notice.postedBy || 'Administration'}</span>
              </div>

              <h3 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>{notice.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>
                {notice.content}
              </p>

              <div className="notice-footer" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', color: 'var(--accent-light)', fontSize: '12px', fontWeight: '600' }}>
                {notice.type || 'General Announcement'}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
