import { useState, useEffect } from 'react';
import { getStudents, getStudentById, updateStudent, deleteStudent, resetPassword, getStudentFeesForAdmin, downloadReceipt } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  UserPlus, 
  IdCard, 
  GraduationCap, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Trash2, 
  Edit, 
  X,
  ChevronRight,
  FileText,
  Camera,
  Download,
  Eye,
  Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [studentFees, setStudentFees] = useState([]);
 
  useEffect(() => { loadStudents(); }, []);
 
  const loadStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };
 
  const viewStudent = async (id) => {
    setIsEditing(false);
    setActiveTab('profile');
    try {
      const res = await getStudentById(id);
      setSelected(res.data.data);
      setEditForm(res.data.data);
      // Fetch fees separately
      getStudentFeesForAdmin(id).then(feesRes => {
        setStudentFees(feesRes.data.data || []);
      }).catch(err => {
        console.warn('Could not fetch student fees:', err);
        setStudentFees([]);
      });
    } catch (err) {
       console.error('Failed to load student details:', err);
       alert('Failed to load student details');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(p => ({ ...p, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!confirm('Save changes to this profile?')) return;
    try {
      await updateStudent(selected.id, editForm);
      setIsEditing(false);
      viewStudent(selected.id);
      loadStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('This will permanently delete the student and all associated records. Proceed?')) return;
    try {
      await deleteStudent(id);
      setSelected(null);
      loadStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!userId) return;
    if (!confirm('Reset security credentials to default?')) return;
    try {
      await resetPassword(userId);
      alert('Password reset to default (123456)');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const filtered = students.filter(s =>
    s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.classForAdmission?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner" />;

  return (
    <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="page-header">
        <div>
          <h1>Student Directory</h1>
          <p>Managing {students.length} academic profiles</p>
        </div>
      </header>

      <div className="search-bar-luxury glass-static">
        <Search size={20} className="muted-icon" />
        <input 
          placeholder="Filter by name, class, or year..."
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <div className="search-indicator">{filtered.length} matches</div>
      </div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div 
            className="empty-state glass-static"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users size={64} className="muted-icon" />
            <h3>Registry is Empty</h3>
            <p>No students match your current search criteria.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="student-grid"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {filtered.map(s => (
              <motion.div 
                key={s.id} 
                variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                className="student-card glass" 
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                onClick={() => viewStudent(s.id)}
              >
                <div className="student-card-header">
                  <div className="student-avatar-wrapper">
                    <div className="avatar">{s.fullName?.[0]}</div>
                  </div>
                  <div className="student-main-info">
                    <h4>{s.fullName}</h4>
                    <span className="class-badge">Class {s.classForAdmission}</span>
                  </div>
                </div>
                <div className="student-card-footer">
                  <div className="meta-item"><IdCard size={14} /> {s.studentId || 'No ID'}</div>
                  <ChevronRight size={16} className="arrow" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div 
              className="modal glass-static student-detail-modal" 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header-profile">
                <div className="profile-summary">
                  <div className="avatar-large">{selected.fullName?.[0]}</div>
                  <div className="text">
                    <h2>{selected.fullName}</h2>
                    <div className="badges">
                      <span className="badge badge-accent">ID: {selected.studentId || 'N/A'}</span>
                      <span className="badge badge-outline">Class {selected.classForAdmission}</span>
                    </div>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelected(null)}><X /></button>
              </div>

              <div className="modal-tabs">
                <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                  <UserPlus size={16} /> Overview
                </button>
                <button className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>
                  <FileText size={16} /> Documents & Fees
                </button>
                <div className="spacer" />
                <button className="action-btn edit" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Eye size={16} /> : <Edit size={16} />} 
                  <span>{isEditing ? 'Preview' : 'Edit'}</span>
                </button>
              </div>

              <div className="modal-content-area">
                {activeTab === 'profile' ? (
                  isEditing ? (
                    <form id="editStudentForm" onSubmit={handleUpdate} className="premium-form">
                      <div className="form-grid">
                        <div className="form-group"><label>Full Name</label><input required className="form-control" name="fullName" value={editForm.fullName || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Date of Birth</label><input type="date" className="form-control" name="dateOfBirth" value={editForm.dateOfBirth || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Gender</label><input required className="form-control" name="gender" value={editForm.gender || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Nationality</label><input required className="form-control" name="nationality" value={editForm.nationality || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Parent Name</label><input required className="form-control" name="parentName" value={editForm.parentName || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Mobile</label><input required className="form-control" name="parentMobile" value={editForm.parentMobile || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Class</label><input required className="form-control" name="classForAdmission" value={editForm.classForAdmission || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Academic Year</label><input required className="form-control" name="academicYear" value={editForm.academicYear || ''} onChange={handleEditChange} /></div>
                      </div>
                    </form>
                  ) : (
                    <div className="info-display">
                      <div className="info-section">
                        <h4><GraduationCap size={16}/> Academic Data</h4>
                        <div className="info-grid">
                          <div className="item"><label>Enrollment Year</label><span>{selected.academicYear || '—'}</span></div>
                          <div className="item"><label>Admission Type</label><span>{selected.admissionType || '—'}</span></div>
                          <div className="item"><label>Previous Grade</label><span>{selected.previousGrade || '—'}</span></div>
                          <div className="item"><label>Last School</label><span>{selected.lastSchoolAttended || '—'}</span></div>
                        </div>
                      </div>
                      <div className="info-section">
                        <h4><Phone size={16}/> Contact & Family</h4>
                        <div className="info-grid">
                          <div className="item"><label>Guardian</label><span>{selected.parentName || '—'}</span></div>
                          <div className="item"><label>Phone</label><span>{selected.parentMobile || '—'}</span></div>
                          <div className="item"><label>Email</label><span>{selected.parentEmail || '—'}</span></div>
                          <div className="item"><label>Address</label><span>{selected.parentAddress || '—'}</span></div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="docs-fees-area">
                    <div className="glass-static doc-card">
                      <div className="card-header">
                        <Camera size={20} className="accent-text" />
                        <h4>Media & Attachments</h4>
                      </div>
                      <div className="media-list">
                        <div className="photo-entry">
                          <div className="photo-preview">
                            {selected.photographPath ? <img src={`${API_URL}/uploads/${selected.photographPath}`} alt="Photo" /> : <Users size={24}/>}
                          </div>
                          <div className="photo-meta">
                            <span>Official Photograph</span>
                            {selected.photographPath && <a href={`${API_URL}/uploads/${selected.photographPath}`} target="_blank"><Download size={14}/> Download</a>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="fee-history-card glass-static">
                      <div className="card-header">
                        <Activity size={20} className="accent-text" />
                        <h4>Payment History</h4>
                      </div>
                      <div className="mini-table-wrapper">
                        {studentFees.length === 0 ? (
                          <div className="empty-mini">No history recorded</div>
                        ) : (
                          <table className="mini-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentFees.map(fee => (
                                <tr key={fee.id}>
                                  <td>{new Date(fee.createdAt).toLocaleDateString()}</td>
                                  <td>{fee.feeType}</td>
                                  <td className="accent-text">₹{fee.amount}</td>
                                  <td><span className={`badge-dot ${fee.status === 'VERIFIED' ? 'success' : 'pending'}`}>{fee.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer-lux">
                <div className="security-actions">
                  {selected.user?.id && (
                    <button className="btn-link" onClick={() => handleResetPassword(selected.user.id)}>
                      <Lock size={14} /> Reset Credentials
                    </button>
                  )}
                  <button className="btn-link danger" onClick={() => handleDelete(selected.id)}>
                    <Trash2 size={14} /> Terminate Record
                  </button>
                </div>
                <div className="main-actions">
                  <button className="btn btn-ghost" onClick={() => setSelected(null)}>Dismiss</button>
                  {isEditing && <button type="submit" form="editStudentForm" className="btn btn-primary">Save Profile</button>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
