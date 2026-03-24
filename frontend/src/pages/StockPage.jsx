import { useState, useEffect } from 'react';
import { getStockItems, createStockItem, updateStockItem, deleteStockItem, issueStockItem, getStockHistory } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Send, 
  History, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Archive,
  Layers,
  LayoutGrid,
  ClipboardList,
  MinusCircle,
  PlusCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = ['Dairy', 'Bench', 'Desk', 'School Belt', 'Dress'];
const DRESS_TYPES = ['Skirt', 'Shirt', 'Pant'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function StockPage() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [mainTab, setMainTab] = useState('inventory');
  const [showModal, setShowModal] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [issueItem, setIssueItemState] = useState(null);
  const [form, setForm] = useState({
    category: '', itemName: '', subType: '', size: '', quantity: 0, unitPrice: 0, description: ''
  });
  const [issueForm, setIssueForm] = useState({ quantity: 1, issuedTo: '', remarks: '' });

  useEffect(() => { loadItems(); }, [filter]);
  useEffect(() => { if (mainTab === 'history') loadHistory(); }, [mainTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await getStockItems(filter);
      setItems(res.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await getStockHistory();
      setHistory(res.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await updateStockItem(editItem.id, form);
      else await createStockItem(form);
      setShowModal(false);
      loadItems();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await issueStockItem(issueItem.id, issueForm);
      setShowIssue(false);
      loadItems();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const totalValue = items.reduce((sum, i) => sum + (i.quantity * (i.unitPrice || 0)), 0);
  const lowStockCount = items.filter(i => i.quantity <= 5).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Inventory Assets</h1>
          <p>Real-time resource tracking and distribution logistics</p>
        </motion.div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => { setIssueItemState(items[0] || null); setShowIssue(true); }}>
            <Send size={18} /> Quick Issue
          </button>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>
            <Plus size={18} /> New Resource
          </button>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="stats-grid" style={{ marginBottom: '32px' }}>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon purple"><Archive size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">Unique Assets</div>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">₹{totalValue.toLocaleString()}</div>
            <div className="stat-label">Inventory Worth</div>
          </div>
        </motion.div>
        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon orange"><Layers size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{items.reduce((s, i) => s + i.quantity, 0)}</div>
            <div className="stat-label">Gross Units</div>
          </div>
        </motion.div>
        <motion.div variants={item} className={`stat-card glass ${lowStockCount > 0 ? 'warning-glow' : ''}`}>
          <div className="stat-icon red"><AlertTriangle size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{lowStockCount}</div>
            <div className="stat-label">Low Stock Alerts</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="premium-tabs-bar">
        <div className="tabs nav-tabs-lux">
          <button className={`tab ${mainTab === 'inventory' ? 'active' : ''}`} onClick={() => setMainTab('inventory')}>
            <LayoutGrid size={16} /> Asset Repository
          </button>
          <button className={`tab ${mainTab === 'history' ? 'active' : ''}`} onClick={() => setMainTab('history')}>
            <ClipboardList size={16} /> Logistics Log
          </button>
        </div>
        
        {mainTab === 'inventory' && (
          <div className="filter-scroll-wrapper">
            <button className={`filter-pill ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All Assets</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal glass-static" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={e => e.stopPropagation()}>
              <h2>{editItem ? 'Edit Asset' : 'New Resource'}</h2>
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resource Name</label>
                    <input className="form-control" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" className="form-control" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input type="number" className="form-control" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: parseFloat(e.target.value)})} required />
                  </div>
                </div>
                <div className="modal-footer-lux">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Asset</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showIssue && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowIssue(false)}>
            <motion.div className="modal glass-static" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={e => e.stopPropagation()}>
              <h2>Issue Resource: {issueItem?.itemName}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Available: {issueItem?.quantity} units</p>
              <form onSubmit={handleIssue} className="premium-form">
                <div className="form-group">
                  <label>Quantity to Issue</label>
                  <input type="number" className="form-control" max={issueItem?.quantity} value={issueForm.quantity} onChange={e => setIssueForm({...issueForm, quantity: parseInt(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Issued To (Name/ID)</label>
                  <input className="form-control" value={issueForm.issuedTo} onChange={e => setIssueForm({...issueForm, issuedTo: e.target.value})} placeholder="Student Name or Dept" required />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea className="form-control" value={issueForm.remarks} onChange={e => setIssueForm({...issueForm, remarks: e.target.value})} />
                </div>
                <div className="modal-footer-lux">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowIssue(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Perfect Issue</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {mainTab === 'inventory' ? (
          <motion.div key="inv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="table-container glass-static premium-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Classification</th>
                  <th>Resource Identity</th>
                  <th>Specifications</th>
                  <th>Availability</th>
                  <th>Valuation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><span className="category-label">{item.category}</span></td>
                    <td>
                      <div className="item-name-cell">
                        <strong>{item.itemName}</strong>
                        {item.description && <span className="item-desc">{item.description}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="item-specs">
                        {item.subType && <span className="spec-tag">{item.subType}</span>}
                        {item.size && <span className="spec-tag">{item.size}</span>}
                        {!item.subType && !item.size && <span className="muted-text">—</span>}
                      </div>
                    </td>
                    <td>
                      <div className={`stock-status ${item.quantity <= 5 ? 'critical' : 'healthy'}`}>
                        <span className="value">{item.quantity}</span>
                        <span className="label">Units</span>
                      </div>
                    </td>
                    <td>
                      <div className="valuation-cell">
                        <div className="unit">₹{item.unitPrice} <small>/ unit</small></div>
                        <div className="total">₹{(item.quantity * (item.unitPrice || 0)).toLocaleString()}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex-actions">
                        <button className="btn-icon-lux success" onClick={() => { setIssueItemState(item); setShowIssue(true); }} title="Issue Resource"><Send size={14} /></button>
                        <button className="btn-icon-lux ghost" onClick={() => { setEditItem(item); setForm({...item}); setShowModal(true); }}><Edit3 size={14} /></button>
                        <button className="btn-icon-lux danger" onClick={async () => { if(confirm('Purge this asset?')) { await deleteStockItem(item.id); loadItems(); } }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="hist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="table-container glass-static premium-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Asset</th>
                  <th>Log Event</th>
                  <th>Delta</th>
                  <th>Inventory State</th>
                  <th>Consignee / Origin</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td><div className="timestamp-lux">{new Date(h.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></td>
                    <td><strong>{h.stockItem?.itemName}</strong></td>
                    <td><span className={`event-pill ${h.action.toLowerCase()}`}>{h.action}</span></td>
                    <td>
                      <span className={`delta-value ${h.quantityChanged < 0 ? 'negative' : 'positive'}`}>
                        {h.quantityChanged > 0 ? <PlusCircle size={12}/> : <MinusCircle size={12}/>}
                        {Math.abs(h.quantityChanged)}
                      </span>
                    </td>
                    <td><div className="qty-trail">{h.quantityBefore} <ArrowRight size={10}/> {h.quantityAfter}</div></td>
                    <td><div className="consignee-lux">{h.issuedTo || h.remarks || 'Standard Transaction'}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals are left similar but with better styling in index.css */}
    </motion.div>
  );
}
