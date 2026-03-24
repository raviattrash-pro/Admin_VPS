import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getPendingPayments, getAllFees, verifyPayment, recordOfflinePayment,
  getStudents, downloadReceipt, getPaymentConfig, updatePaymentConfig
} from '../api/api';
import { 
  Wallet, 
  Settings, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  FileText, 
  IndianRupee, 
  QrCode,
  AlertCircle,
  Download,
  Clock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function FeeManagementPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('pending');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOffline, setShowOffline] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [offlineForm, setOfflineForm] = useState({ studentId: '', amount: '', feeType: '', remarks: '' });
  const [studentSearch, setStudentSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [configForm, setConfigForm] = useState({ upiId: '', accountHolderName: '', bankName: '', qrCode: null });
 
  const [previewImg, setPreviewImg] = useState(null);
 
  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feesRes, studentsRes, configRes] = await Promise.all([
        tab === 'pending' ? getPendingPayments() : getAllFees(),
        getStudents(),
        getPaymentConfig()
      ]);
      setFees(feesRes.data.data || []);
      setStudents(studentsRes.data.data || []);
      const c = configRes.data.data;
      setConfig(c);
      setConfigForm({ upiId: c?.upiId || '', accountHolderName: c?.accountHolderName || '', bankName: c?.bankName || '', qrCode: null });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleVerify = async (id, approved) => {
    try {
      await verifyPayment(id, approved);
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleOffline = async (e) => {
    e.preventDefault();
    if (!offlineForm.studentId) { alert('Please select a student from the list'); return; }
    try {
      await recordOfflinePayment(offlineForm);
      setShowOffline(false);
      setOfflineForm({ studentId: '', amount: '', feeType: '', remarks: '' });
      setStudentSearch('');
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };
 
  const filteredStudents = students.filter(s =>
    s.fullName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.aadhaarOrSamagraId?.includes(studentSearch)
  ).slice(0, 5);
 
  const selectStudent = (s) => {
    setOfflineForm(p => ({ ...p, studentId: s.id }));
    setStudentSearch(`${s.fullName} (${s.aadhaarOrSamagraId})`);
    setShowResults(false);
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('upiId', configForm.upiId);
      fd.append('accountHolderName', configForm.accountHolderName);
      fd.append('bankName', configForm.bankName);
      if (configForm.qrCode) fd.append('qrCode', configForm.qrCode);
 
      await updatePaymentConfig(fd);
      setShowConfig(false);
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
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

  const getStudentName = (fee) => fee.student?.fullName || 'Unknown';

  return (
    <div className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Fee Management</h1>
          <p>Streamlined financial tracking and verification</p>
        </motion.div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => setShowConfig(true)}>
            <Settings size={18} /> Configuration
          </button>
          <button className="btn btn-primary" onClick={() => setShowOffline(true)}>
            <Plus size={18} /> Record Cash Payment
          </button>
        </div>
      </header>

      {/* Payment Config Info */}
      <AnimatePresence>
        {config && config.upiId && (
          <motion.div 
            className="glass-static config-summary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div className="config-item">
              <QrCode size={16} className="accent-color" />
              <span className="label">Active Merchant:</span>
              <span className="value">{config.accountHolderName}</span>
            </div>
            <div className="config-item">
              <IndianRupee size={16} className="accent-color" />
              <span className="label">UPI ID:</span>
              <span className="value accent-text">{config.upiId}</span>
            </div>
            <div className="config-item">
              <Settings size={16} className="accent-color" />
              <span className="label">Bank:</span>
              <span className="value">{config.bankName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tabs premium-tabs">
        <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
          <Clock size={16} /> Pending Verifications
          {fees.length > 0 && tab === 'pending' && <span className="tab-badge">{fees.length}</span>}
        </button>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          <FileText size={16} /> Transaction History
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '300px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.div>
        </div>
      ) : (
        <motion.div 
          className="table-container glass-static premium-table"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {fees.length === 0 ? (
            <div className="empty-state">
              <Wallet size={48} className="muted-icon" />
              <h3>No Transactions Found</h3>
              <p>Everything is up to date.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <motion.tr key={fee.id} layout>
                    <td>
                      <div className="student-cell">
                        <div className="avatar-sm">{getStudentName(fee).charAt(0)}</div>
                        <div className="details">
                          <div className="name">{getStudentName(fee)}</div>
                          <div className="id">{fee.student?.studentId || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="amount-cell">₹{fee.amount}</td>
                    <td><span className="fee-type-tag">{fee.feeType || 'General'}</span></td>
                    <td>
                      <span className={`badge ${fee.paymentMode === 'ONLINE' ? 'badge-info' : 'badge-warning'}`}>
                        {fee.paymentMode}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${fee.status === 'VERIFIED' ? 'badge-success' : fee.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      {fee.screenshotPath ? (
                        <motion.div 
                          className="screenshot-wrapper"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => setPreviewImg(`${API_URL}/uploads/${fee.screenshotPath}`)}
                        >
                          <img src={`${API_URL}/uploads/${fee.screenshotPath}`} alt="screenshot" />
                          <div className="overlay"><Search size={14} /></div>
                        </motion.div>
                      ) : <span className="muted-text">—</span>}
                    </td>
                    <td>
                      <div className="action-cell">
                        {fee.status === 'PENDING' && (
                          <>
                            <button className="btn btn-success btn-sm btn-icon" onClick={() => handleVerify(fee.id, true)}><CheckCircle size={14} /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleVerify(fee.id, false)}><XCircle size={14} /></button>
                          </>
                        )}
                        {fee.status === 'VERIFIED' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(fee.id)}>
                            <Download size={14} /> Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* Screenshot Preview Modal */}
      <AnimatePresence>
        {previewImg && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImg(null)}
          >
            <motion.div 
              className="glass-static preview-modal" 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            >
              <img src={previewImg} alt="Payment Screenshot" />
              <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }} onClick={() => setPreviewImg(null)}>Close Preview</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Payment Modal */}
      <AnimatePresence>
        {showOffline && (
          <motion.div className="modal-overlay" onClick={() => setShowOffline(false)}>
            <motion.div className="modal glass-static" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><Wallet size={20}/> Record Cash Payment</h2>
              </div>
              <form onSubmit={handleOffline} className="modal-body">
                <div className="form-group">
                  <label>Student Search</label>
                  <div className="search-container luxury-search">
                    <Search className="search-icon" size={16} />
                    <input
                      className="form-control"
                      placeholder="Name or Aadhaar ID..."
                      value={studentSearch}
                      onChange={e => {
                        setStudentSearch(e.target.value);
                        setShowResults(true);
                        setOfflineForm(p => ({ ...p, studentId: '' }));
                      }}
                      onFocus={() => setShowResults(true)}
                      required
                    />
                    {showResults && studentSearch && (
                      <div className="search-dropdown glass">
                        {filteredStudents.length === 0 ? (
                          <div className="search-item empty">No students found</div>
                        ) : (
                          filteredStudents.map(s => (
                            <div key={s.id} className="search-item" onClick={() => selectStudent(s)}>
                              <div className="item-main">{s.fullName}</div>
                              <div className="item-sub">ID: {s.studentId} • Class: {s.classForAdmission}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input className="form-control" type="number" value={offlineForm.amount}
                      onChange={e => setOfflineForm(p => ({ ...p, amount: e.target.value }))} required placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Fee Category</label>
                    <select className="form-control" value={offlineForm.feeType}
                      onChange={e => setOfflineForm(p => ({ ...p, feeType: e.target.value }))} required>
                      <option value="">Select Type</option>
                      <option value="Tuition">Tuition Fee</option>
                      <option value="Transport">Transport Fee</option>
                      <option value="Exam">Exam Fee</option>
                      <option value="Admission">Admission Fee</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea className="form-control" rows="2" value={offlineForm.remarks}
                    onChange={e => setOfflineForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Payment details..."></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowOffline(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm Receipt</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfig && (
          <motion.div className="modal-overlay" onClick={() => setShowConfig(false)}>
            <motion.div className="modal glass-static" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><Settings size={20}/> Payment Settings</h2>
              </div>
              <form onSubmit={handleConfigUpdate} className="modal-body">
                <div className="form-group">
                  <label>Business UPI ID</label>
                  <input className="form-control" value={configForm.upiId}
                    onChange={e => setConfigForm(p => ({ ...p, upiId: e.target.value }))} placeholder="school@upi" required />
                </div>
                <div className="form-group">
                  <label>Merchant Name</label>
                  <input className="form-control" value={configForm.accountHolderName}
                    onChange={e => setConfigForm(p => ({ ...p, accountHolderName: e.target.value }))} placeholder="Institution Name" />
                </div>
                <div className="form-group">
                  <label>Bank Institution</label>
                  <input className="form-control" value={configForm.bankName}
                    onChange={e => setConfigForm(p => ({ ...p, bankName: e.target.value }))} placeholder="e.g. HDFC Bank" />
                </div>
  
                <div className="form-group">
                  <label>Official QR Code</label>
                  <div className="file-upload luxury-upload">
                    <input type="file" accept="image/*" onChange={e => setConfigForm(p => ({ ...p, qrCode: e.target.files[0] }))} />
                    <QrCode size={32} className="upload-icon" />
                    <div className="upload-text">{configForm.qrCode ? configForm.qrCode.name : 'Upload New QR Image'}</div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowConfig(false)}>Discard</button>
                  <button type="submit" className="btn btn-primary">Apply Configuration</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
