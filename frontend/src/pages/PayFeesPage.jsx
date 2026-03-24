import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPaymentConfig, submitPayment, getMyFees, downloadReceipt } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  History, 
  QrCode, 
  Copy, 
  Check, 
  UploadCloud, 
  AlertCircle, 
  IndianRupee, 
  ShieldCheck,
  Download,
  Search,
  ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function PayFeesPage() {
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pay');
  const [amount, setAmount] = useState('');
  const [feeType, setFeeType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const configRes = await getPaymentConfig();
      setConfig(configRes.data.data);
    } catch (err) { console.error('Config load error:', err); }

    try {
      const feesRes = await getMyFees();
      setFees(feesRes.data.data || []);
    } catch (err) { console.error('Fees load error:', err); }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      const fd = new FormData();
      fd.append('amount', amount);
      if (feeType) fd.append('feeType', feeType);
      if (transactionId) fd.append('transactionId', transactionId);
      if (screenshot) fd.append('screenshot', screenshot);
      await submitPayment(fd);
      setSuccess('Payment submitted for verification. Admin will notify you once confirmed.');
      setAmount('');
      setFeeType('');
      setTransactionId('');
      setScreenshot(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment submission failed');
    }
    setSubmitting(false);
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

  const copyUpi = () => {
    if (config?.upiId) {
      navigator.clipboard.writeText(config.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="loading-spinner" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Fee Settlement</h1>
          <p>Securely contribute to your academic journey</p>
        </motion.div>
      </header>

      <div className="premium-tabs nav-tabs-lux">
        <button className={`tab ${tab === 'pay' ? 'active' : ''}`} onClick={() => setTab('pay')}>
          <CreditCard size={18} /> Direct Payment
        </button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          <History size={18} /> Contribution History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'pay' ? (
          <motion.div 
            key="pay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="payment-grid-lux"
          >
            {/* Payment Portal Info */}
            <div className="section-card-lux payment-info-card">
              <div className="modal-header-lux">
                <QrCode size={28} className="accent-text" />
                <h2>Scanning Station</h2>
              </div>
              
              <div className="qr-section-lux">
                {config?.qrCodePath ? (
                  <div className="qr-wrapper-lux">
                    <img 
                      src={`${API_URL}/uploads/${config.qrCodePath}`} 
                      alt="Payment QR" 
                      className="qr-img"
                    />
                    <div className="qr-glow"></div>
                  </div>
                ) : (
                  <div className="qr-placeholder">
                    <QrCode size={64} className="muted-icon" />
                    <p>Encryption Key / QR Generating...</p>
                  </div>
                )}
              </div>

              <div className="upi-details-lux">
                <div className="upi-badge-premium" onClick={copyUpi} title="Click to Copy">
                  <div className="upi-info-box">
                    <label>TRANSFER DOMAIN (UPI ID)</label>
                    <span>{config?.upiId || 'Not Configured'}</span>
                  </div>
                  <div className="copy-action-box">
                    {copied ? <Check size={20} className="success-text" /> : <Copy size={20} />}
                  </div>
                </div>
                <div className="merchant-verification">
                  <ShieldCheck size={18} className="success-text" />
                  <span>Authorized Merchant: <strong>{config?.accountHolderName}</strong></span>
                </div>
              </div>
            </div>

            {/* Submission Form */}
            <div className="section-card-lux payment-form-card">
              <div className="modal-header-lux">
                <CreditCard size={28} className="accent-text" />
                <h2>Submission Portal</h2>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="alert-box success"
                    style={{ marginBottom: '24px' }}
                  >
                    <Check size={20} /> {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="lux-form">
                <div className="form-row-half">
                  <div className="form-group">
                    <label>Allocation Amount (INR)</label>
                    <div className="input-with-icon">
                      <IndianRupee size={16} />
                      <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Fee Category</label>
                    <select className="form-control" value={feeType} onChange={e => setFeeType(e.target.value)} required>
                      <option value="">Select Purpose</option>
                      <option value="Tuition">Tuition Fee</option>
                      <option value="Transport">Transport Fee</option>
                      <option value="Exam">Exam Fee</option>
                      <option value="Admission">Admission Fee</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Transaction ID / UTR Number</label>
                  <input className="form-control" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Enter 12-digit UTR identifier" />
                </div>

                <div className="form-group">
                  <label>Official Payment Evidence (Screenshot)</label>
                  <div className="lux-file-upload">
                    <input type="file" accept="image/*" onChange={e => setScreenshot(e.target.files[0])} required />
                    <div className="upload-content">
                      <UploadCloud size={32} className="accent-text" />
                      <p>{screenshot ? screenshot.name : 'Drop or Tap to Upload'}</p>
                      <span>Supports High-Res JPG, PNG</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary admit-btn" disabled={submitting} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                  {submitting ? 'Authenticating Submission...' : 'Finalize Settlement Request'}
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="table-container glass-static premium-table"
          >
            {fees.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={48} className="muted-icon" />
                <h3>No History Found</h3>
                <p>Maintain a record of all your contributions here.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contribution Date</th>
                    <th>Fiscal Amount</th>
                    <th>Fee Segment</th>
                    <th>Status</th>
                    <th>Official Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(fee => (
                    <tr key={fee.id}>
                      <td>{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td className="accent-text font-bold">₹{fee.amount}</td>
                      <td><span className="fee-tag">{fee.feeType || 'General'}</span></td>
                      <td>
                        <div className={`status-pill ${fee.status.toLowerCase()}`}>
                          {fee.status}
                        </div>
                      </td>
                      <td>
                        {fee.status === 'VERIFIED' ? (
                          <button className="btn-icon-text" onClick={() => handleDownload(fee.id)}>
                            <Download size={14} /> <span>Get PDF</span>
                          </button>
                        ) : <span className="muted-text">Processing</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
