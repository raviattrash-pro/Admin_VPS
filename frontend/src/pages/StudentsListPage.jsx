import { useState, useEffect } from 'react';
import { getStudents, getStudentById, updateStudent, deleteStudent, resetPassword, getStudentFeesForAdmin, downloadReceipt, getUploadUrl } from '../api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Activity,
  Shield
} from 'lucide-react';


export default function StudentsListPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [studentFees, setStudentFees] = useState([]);

  const { data: studentsRes, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const students = studentsRes?.data?.data || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      if (selected) viewStudent(selected.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelected(null);
    },
  });
 
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
      await updateMutation.mutateAsync({ id: selected.id, data: editForm });
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('This will permanently delete the student and all associated records. Proceed?')) return;
    try {
      await deleteMutation.mutateAsync(id);
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

  if (isLoading) return (
    <div className="flex-center" style={{ height: '300px' }}>
      <div className="loading-spinner-lux" />
    </div>
  );

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
                    <div className="avatar">
                      {s.photographPath ? (
                        <img 
                          src={getUploadUrl(s.photographPath)} 
                          alt={s.fullName} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                        />
                      ) : (
                        s.fullName?.[0]
                      )}
                    </div>
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
                  <div className="avatar-large">
                    {selected.photographPath ? (
                      <img 
                        src={getUploadUrl(selected.photographPath)} 
                        alt={selected.fullName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                      />
                    ) : (
                      selected.fullName?.[0]
                    )}
                  </div>
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
                    <form id="editStudentForm" onSubmit={handleUpdate} className="premium-form-expanded">
                      <div className="form-sections">
                        <div className="form-sub-section">
                          <h5>Personal Details</h5>
                          <div className="form-grid">
                            <div className="form-group"><label>Full Name</label><input required className="form-control" name="fullName" value={editForm.fullName || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>DOB</label><input type="date" className="form-control" name="dateOfBirth" value={editForm.dateOfBirth || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Gender</label><input className="form-control" name="gender" value={editForm.gender || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Nationality</label><input className="form-control" name="nationality" value={editForm.nationality || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Mother Tongue</label><input className="form-control" name="motherTongue" value={editForm.motherTongue || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Blood Group</label><input className="form-control" name="bloodGroup" value={editForm.bloodGroup || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Category</label><input className="form-control" name="category" value={editForm.category || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Aadhaar/Samagra ID</label><input className="form-control" name="aadhaarOrSamagraId" value={editForm.aadhaarOrSamagraId || ''} onChange={handleEditChange} /></div>
                          </div>
                        </div>

                        <div className="form-sub-section">
                          <h5>Academic Details</h5>
                          <div className="form-grid">
                            <div className="form-group"><label>Class</label><input className="form-control" name="classForAdmission" value={editForm.classForAdmission || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Academic Year</label><input className="form-control" name="academicYear" value={editForm.academicYear || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Admission Type</label><input className="form-control" name="admissionType" value={editForm.admissionType || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Previous Grade</label><input className="form-control" name="previousGrade" value={editForm.previousGrade || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Marks Obtained</label><input className="form-control" name="marksObtained" value={editForm.marksObtained || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Board</label><input className="form-control" name="board" value={editForm.board || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Last School</label><input className="form-control" name="lastSchoolAttended" value={editForm.lastSchoolAttended || ''} onChange={handleEditChange} /></div>
                          </div>
                        </div>

                        <div className="form-sub-section">
                          <h5>Guardian Details</h5>
                          <div className="form-grid">
                            <div className="form-group"><label>Parent Name</label><input className="form-control" name="parentName" value={editForm.parentName || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Occupation</label><input className="form-control" name="parentOccupation" value={editForm.parentOccupation || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Mobile</label><input className="form-control" name="parentMobile" value={editForm.parentMobile || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Email</label><input className="form-control" name="parentEmail" value={editForm.parentEmail || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Address</label><textarea className="form-control" name="parentAddress" value={editForm.parentAddress || ''} onChange={handleEditChange} /></div>
                          </div>
                        </div>

                        <div className="form-sub-section">
                          <h5>Medical & Misc</h5>
                          <div className="form-grid">
                            <div className="form-group"><label>Allergies</label><input className="form-control" name="knownAllergies" value={editForm.knownAllergies || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Conditions</label><input className="form-control" name="medicalConditions" value={editForm.medicalConditions || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Emergency Contact</label><input className="form-control" name="emergencyContact" value={editForm.emergencyContact || ''} onChange={handleEditChange} /></div>
                            <div className="form-group"><label>Transport Required</label>
                              <select className="form-control" name="transportRequired" value={editForm.transportRequired ? 'true' : 'false'} onChange={e => handleEditChange({ target: { name: 'transportRequired', value: e.target.value === 'true' } })}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="info-display">
                      <div className="info-section">
                        <h4><IdCard size={16}/> Personal Identity</h4>
                        <div className="info-grid">
                          <div className="item"><label>DOB</label><span>{selected.dateOfBirth || '—'}</span></div>
                          <div className="item"><label>Gender</label><span>{selected.gender || '—'}</span></div>
                          <div className="item"><label>Nationality</label><span>{selected.nationality || '—'}</span></div>
                          <div className="item"><label>Mother Tongue</label><span>{selected.motherTongue || '—'}</span></div>
                          <div className="item"><label>Category</label><span>{selected.category || '—'}</span></div>
                          <div className="item"><label>Blood Group</label><span>{selected.bloodGroup || '—'}</span></div>
                          <div className="item"><label>Aadhaar/Samagra</label><span>{selected.aadhaarOrSamagraId || '—'}</span></div>
                        </div>
                      </div>

                      <div className="info-section">
                        <h4><GraduationCap size={16}/> Academic Data</h4>
                        <div className="info-grid">
                          <div className="item"><label>Academic Year</label><span>{selected.academicYear || '—'}</span></div>
                          <div className="item"><label>Admission Type</label><span>{selected.admissionType || '—'}</span></div>
                          <div className="item"><label>Previous Grade</label><span>{selected.previousGrade || '—'}</span></div>
                          <div className="item"><label>Marks Obtained</label><span>{selected.marksObtained || '—'}</span></div>
                          <div className="item"><label>Board</label><span>{selected.board || '—'}</span></div>
                          <div className="item"><label>Last School</label><span>{selected.lastSchoolAttended || '—'}</span></div>
                        </div>
                      </div>

                      <div className="info-section">
                        <h4><Shield size={16}/> Guardian Details</h4>
                        <div className="info-grid">
                          <div className="item"><label>Guardian Name</label><span>{selected.parentName || '—'}</span></div>
                          <div className="item"><label>Occupation</label><span>{selected.parentOccupation || '—'}</span></div>
                          <div className="item"><label>Phone</label><span>{selected.parentMobile || '—'}</span></div>
                          <div className="item"><label>Email</label><span>{selected.parentEmail || '—'}</span></div>
                          <div className="item"><label>Address</label><span>{selected.parentAddress || '—'}</span></div>
                        </div>
                      </div>

                      <div className="info-section">
                        <h4><Activity size={16} /> Health & Welfare</h4>
                        <div className="info-grid">
                          <div className="item"><label>Allergies</label><span>{selected.knownAllergies || 'None'}</span></div>
                          <div className="item"><label>Medical Conditions</label><span>{selected.medicalConditions || 'None'}</span></div>
                          <div className="item"><label>Emergency Contact</label><span>{selected.emergencyContact || '—'}</span></div>
                          <div className="item"><label>Transport</label><span>{selected.transportRequired ? 'Required' : 'Not Required'}</span></div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="docs-fees-area">
                    <div className="glass-static doc-card">
                      <div className="card-header">
                        <Camera size={20} className="accent-text" />
                        <h4>Official Documentation</h4>
                      </div>
                      <div className="media-list-luxury">
                        <div className="doc-entry">
                          <div className="preview-small">{selected.photographPath ? <img src={getUploadUrl(selected.photographPath)} alt="Photo" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Photo'; }} /> : <Users size={20}/>}</div>
                          <div className="doc-info"><span>Photograph</span>{selected.photographPath && <a href={getUploadUrl(selected.photographPath)} target="_blank" rel="noreferrer"><Download size={14}/> Download</a>}</div>
                        </div>
                        <div className="doc-entry">
                          <div className="preview-small"><FileText size={20}/></div>
                          <div className="doc-info"><span>Birth Certificate</span>{selected.birthCertificatePath && <a href={getUploadUrl(selected.birthCertificatePath)} target="_blank" rel="noreferrer"><Download size={14}/> Download</a>}</div>
                        </div>
                        <div className="doc-entry">
                          <div className="preview-small"><FileText size={20}/></div>
                          <div className="doc-info"><span>Transfer Certificate</span>{selected.transferCertificatePath && <a href={getUploadUrl(selected.transferCertificatePath)} target="_blank" rel="noreferrer"><Download size={14}/> Download</a>}</div>
                        </div>
                        <div className="doc-entry">
                          <div className="preview-small"><FileText size={20}/></div>
                          <div className="doc-info"><span>Report Card</span>{selected.reportCardPath && <a href={getUploadUrl(selected.reportCardPath)} target="_blank" rel="noreferrer"><Download size={14}/> Download</a>}</div>
                        </div>
                        <div className="doc-entry">
                          <div className="preview-small"><MapPin size={20}/></div>
                          <div className="doc-info"><span>Residence Proof</span>{selected.proofOfResidencePath && <a href={getUploadUrl(selected.proofOfResidencePath)} target="_blank" rel="noreferrer"><Download size={14}/> Download</a>}</div>
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
