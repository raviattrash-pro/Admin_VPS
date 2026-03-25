import { useState } from 'react';
import { createStudent } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  IdCard, 
  GraduationCap, 
  History, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  FileText, 
  Activity, 
  MapPin, 
  HeartPulse, 
  Info,
  ArrowRight,
  Shield,
  Key,
  Copy
} from 'lucide-react';

export default function AdmissionPage() {
  const [form, setForm] = useState({
    fullName: '', dateOfBirth: '', gender: '', nationality: 'Indian',
    motherTongue: '', category: '', bloodGroup: '', aadhaarOrSamagraId: '',
    parentName: '', parentOccupation: '', parentAddress: '', parentMobile: '', parentEmail: '',
    lastSchoolAttended: '', board: '', previousGrade: '', marksObtained: '',
    classForAdmission: '', academicYear: '2025-2026', admissionType: 'New',
    knownAllergies: '', medicalConditions: '', emergencyContact: '',
    siblingsInSchool: '', transportRequired: false, languagePreferences: ''
  });
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFile = (e) => {
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      Object.entries(files).forEach(([k, v]) => { if (v) formData.append(k, v); });

      const res = await createStudent(formData);
      setResult(res.data);
      setForm({
        fullName: '', dateOfBirth: '', gender: '', nationality: 'Indian',
        motherTongue: '', category: '', bloodGroup: '', aadhaarOrSamagraId: '',
        parentName: '', parentOccupation: '', parentAddress: '', parentMobile: '', parentEmail: '',
        lastSchoolAttended: '', board: '', previousGrade: '', marksObtained: '',
        classForAdmission: '', academicYear: '2025-2026', admissionType: 'New',
        knownAllergies: '', medicalConditions: '', emergencyContact: '',
        siblingsInSchool: '', transportRequired: false, languagePreferences: ''
      });
      setFiles({});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to admit student');
    } finally {
      setLoading(false);
    }
  };

  const copyCreds = () => {
    if (result?.data) {
      const text = `Username: ${result.data.username}\nPassword: ${result.data.defaultPassword}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Student Admission</h1>
          <p>Digitize the enrollment process with automated credentials</p>
        </motion.div>
      </header>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="glass-static registration-success-card"
          >
            <div className="card-header-lux">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <ShieldCheck size={32} className="success-text" />
                {files.photograph && (
                  <img 
                    src={URL.createObjectURL(files.photograph)} 
                    alt="Preview" 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--success)' }} 
                  />
                )}
              </div>
              <div className="text">
                <h3>Admission Successful!</h3>
                <p>Academic records have been initialized and secured.</p>
              </div>
            </div>
            <div className="credentials-box" onClick={copyCreds}>
              <div className="cred-item">
                <label><Key size={14}/> Student Username</label>
                <span>{result.data?.username}</span>
              </div>
              <div className="cred-divider"></div>
              <div className="cred-item">
                <label><Shield size={14}/> Access Password</label>
                <span>{result.data?.defaultPassword}</span>
              </div>
              <div className="copy-indicator">
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </div>
            </div>
            <p className="notice-mini">Click the card to copy credentials for the student.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="alert-box error">
          <AlertCircle size={18} /> {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="lux-form">
        <div className="form-sections-stack">
          {/* Section 1: Personal */}
          <section className="section-card-lux">
            <div className="modal-header-lux">
              <IdCard size={28} className="accent-text" />
              <h2>Personal Identity</h2>
            </div>
            <div className="form-row-half">
              <div className="form-group"><label>Full Name *</label><input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Student Legal Name" /></div>
              <div className="form-group"><label>Date of Birth</label><input type="date" className="form-control" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} /></div>
            </div>
            <div className="form-row-half">
              <div className="form-group">
                <label>Gender Selection</label>
                <select className="form-control" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="form-row-half">
              <div className="form-group"><label>Nationality</label><input className="form-control" name="nationality" value={form.nationality} onChange={handleChange} /></div>
              <div className="form-group"><label>Mother Tongue</label><input className="form-control" name="motherTongue" value={form.motherTongue} onChange={handleChange} placeholder="e.g. Hindi, English" /></div>
            </div>
            <div className="form-row-half">
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select className="form-control" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Samagra/Aadhaar Identifier *</label><input className="form-control" name="aadhaarOrSamagraId" value={form.aadhaarOrSamagraId} onChange={handleChange} required placeholder="Unique ID Number" /></div>
          </section>

          {/* Section 2: Parent */}
          <section className="section-card-lux">
            <div className="modal-header-lux">
              <Shield size={28} className="accent-text" />
              <h2>Guardian Details</h2>
            </div>
            <div className="form-group"><label>Parent/Guardian Legal Name</label><input className="form-control" name="parentName" value={form.parentName} onChange={handleChange} placeholder="Primary Guardian" /></div>
            <div className="form-row-half">
              <div className="form-group"><label>Emergency Mobile</label><input className="form-control" name="parentMobile" value={form.parentMobile} onChange={handleChange} placeholder="+91" /></div>
              <div className="form-group"><label>Official Email</label><input className="form-control" name="parentEmail" type="email" value={form.parentEmail} onChange={handleChange} placeholder="example@mail.com" /></div>
            </div>
            <div className="form-group"><label>Parent Occupation</label><input className="form-control" name="parentOccupation" value={form.parentOccupation} onChange={handleChange} placeholder="e.g. Business, Service" /></div>
            <div className="form-group"><label>Home Address</label><textarea className="form-control" name="parentAddress" value={form.parentAddress} onChange={handleChange} rows="2" placeholder="Full residential details" /></div>
          </section>

          {/* Section 3: Academic */}
          <section className="section-card-lux">
            <div className="modal-header-lux">
              <GraduationCap size={28} className="accent-text" />
              <h2>Academic Background</h2>
            </div>
            <div className="form-row-half">
              <div className="form-group"><label>Class of Admission *</label>
                <select className="form-control" name="classForAdmission" value={form.classForAdmission} onChange={handleChange} required>
                  <option value="">Select Enrolling Class</option>
                  {['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>Grade {c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Previous Grade Result</label><input className="form-control" name="previousGrade" value={form.previousGrade} onChange={handleChange} placeholder="Percentage / GPA" /></div>
            </div>
            <div className="form-group"><label>Last Educational Institution</label><input className="form-control" name="lastSchoolAttended" value={form.lastSchoolAttended} onChange={handleChange} placeholder="School Name" /></div>
            <div className="form-row-half">
              <div className="form-group"><label>Board (CBSE/State/ICSE)</label><input className="form-control" name="board" value={form.board} onChange={handleChange} placeholder="e.g. CBSE" /></div>
              <div className="form-group"><label>Total Marks Obtained</label><input className="form-control" name="marksObtained" value={form.marksObtained} onChange={handleChange} placeholder="e.g. 450/500" /></div>
            </div>
          </section>

          {/* Section 4: Health & Misc */}
          <section className="section-card-lux">
            <div className="modal-header-lux">
              <HeartPulse size={28} className="accent-text" />
              <h2>Health & Welfare</h2>
            </div>
            <div className="form-row-half">
              <div className="form-group"><label>Emergency Medical Contact</label><input className="form-control" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} /></div>
              <div className="form-group"><label>Critical Medical Notes</label><input className="form-control" name="medicalConditions" value={form.medicalConditions} onChange={handleChange} placeholder="Allergies / Conditions" /></div>
            </div>
            <div className="form-group checkbox-lux">
              <input type="checkbox" name="transportRequired" checked={form.transportRequired} onChange={handleChange} id="lux-transport" />
              <label htmlFor="lux-transport">Require Institutional Transport Services</label>
            </div>
          </section>

          {/* Section 5: Documents */}
          <section className="section-card-lux">
            <div className="modal-header-lux">
              <FileText size={28} className="accent-text" />
              <h2>Official Documentation</h2>
            </div>
            <div className="form-row-half">
              {[
                { name: 'photograph', label: 'Photograph', icon: <Camera size={18}/> },
                { name: 'birthCertificate', label: 'Birth Cert', icon: <FileText size={18}/> },
                { name: 'transferCertificate', label: 'Transfer Cert', icon: <FileText size={18}/> },
                { name: 'reportCard', label: 'Report Card', icon: <FileText size={18}/> },
                { name: 'proofOfResidence', label: 'Residence Proof', icon: <MapPin size={18}/> }
              ].map(doc => (
                <div key={doc.name} className="mini-upload-lux">
                  <input type="file" name={doc.name} onChange={handleFile} id={`file-${doc.name}`} style={{ display: 'none' }} />
                  <label htmlFor={`file-${doc.name}`} className="upload-btn">
                    {doc.icon}
                    <span>{files[doc.name] ? 'Attached' : doc.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="form-actions-lux">
          <button type="submit" className="btn btn-primary admit-btn" disabled={loading} style={{ width: '100%', height: '56px', fontSize: '16px' }}>
            {loading ? 'Initializing Academic Profile...' : 'Complete Institutional Admission'}
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
