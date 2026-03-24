import { useState, useEffect } from 'react';
import { getProfitLossSummary, getExpenses, createExpense, updateExpense, deleteExpense } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  PieChart, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Briefcase,
  Wallet,
  IndianRupee,
  Layout
} from 'lucide-react';

const EXPENSE_CATEGORIES = ['Salary', 'Maintenance', 'Utilities', 'Supplies', 'Transport', 'Infrastructure', 'Events', 'Other'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export default function ProfitLossPage() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    category: '', description: '', amount: '', expenseDate: '', paidTo: '', remarks: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, expensesRes] = await Promise.all([getProfitLossSummary(), getExpenses()]);
      setSummary(summaryRes.data.data);
      setExpenses(expensesRes.data.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ category: '', description: '', amount: '', expenseDate: new Date().toISOString().split('T')[0], paidTo: '', remarks: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await updateExpense(editItem.id, form);
      else await createExpense(form);
      setShowModal(false);
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="loading-spinner" />;

  const profitLoss = summary?.profitLoss || 0;
  const isProfit = profitLoss >= 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fade-in">
      <header className="page-header">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1>Financial Intelligence</h1>
          <p>Fiscal stewardship and revenue analytics across all school operations</p>
        </motion.div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={18} /> Record Expenditure
          </button>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="stats-grid" style={{ marginBottom: '32px' }}>
        <motion.div variants={item} className="stat-card glass luxury-income">
          <div className="stat-icon green"><TrendingUp size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">₹{Number(summary?.totalIncome || 0).toLocaleString()}</div>
            <div className="stat-label">Gross Revenue</div>
          </div>
          <ArrowUpRight className="card-decoration positive" size={64} />
        </motion.div>
        
        <motion.div variants={item} className="stat-card glass luxury-expense">
          <div className="stat-icon red"><TrendingDown size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">₹{Number(summary?.totalExpenses || 0).toLocaleString()}</div>
            <div className="stat-label">Total Outflow</div>
          </div>
          <ArrowDownRight className="card-decoration negative" size={64} />
        </motion.div>

        <motion.div variants={item} className={`stat-card glass ${isProfit ? 'profit-card' : 'loss-card'}`}>
          <div className="stat-icon purple"><Activity size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">
              {isProfit ? '+' : ''}₹{Number(profitLoss).toLocaleString()}
            </div>
            <div className="stat-label">{isProfit ? 'Net Capital Gain' : 'Net Deficit'}</div>
          </div>
        </motion.div>

        <motion.div variants={item} className="stat-card glass">
          <div className="stat-icon blue"><PieChart size={24} /></div>
          <div className="stat-content">
            <div className="stat-value">{(summary?.totalFeeRecords || 0) + (summary?.totalExpenseRecords || 0)}</div>
            <div className="stat-label">Fiscal Entries</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="premium-tabs nav-tabs-lux">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          <BarChart3 size={18} /> Breakdown Analysis
        </button>
        <button className={`tab ${tab === 'expenses' ? 'active' : ''}`} onClick={() => setTab('expenses')}>
          <CreditCard size={18} /> Expenditure Log
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="breakdown-grid-lux"
          >
            {/* Income Breakdown */}
            <div className="glass-static breakdown-card income">
              <div className="card-header-mini">
                <TrendingUp size={20} className="success-text" />
                <h3>Revenue Segments</h3>
              </div>
              <div className="progress-list-lux">
                {Object.entries(summary?.incomeByType || {}).map(([type, amount]) => {
                  const pct = summary.totalIncome > 0 ? (Number(amount) / Number(summary.totalIncome) * 100) : 0;
                  return (
                    <div key={type} className="progress-item-lux">
                      <div className="progress-info">
                        <span className="label">{type}</span>
                        <span className="value">₹{Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <motion.div 
                          className="progress-bar-fill success"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="glass-static breakdown-card expense">
              <div className="card-header-mini">
                <TrendingDown size={20} className="danger-text" />
                <h3>Outflow Categories</h3>
              </div>
              <div className="progress-list-lux">
                {Object.entries(summary?.expenseByCategory || {}).map(([cat, amount]) => {
                  const pct = summary.totalExpenses > 0 ? (Number(amount) / Number(summary.totalExpenses) * 100) : 0;
                  return (
                    <div key={cat} className="progress-item-lux">
                      <div className="progress-info">
                        <span className="label">{cat}</span>
                        <span className="value">₹{Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <motion.div 
                          className="progress-bar-fill danger"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="expenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="table-container glass-static premium-table"
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filing Date</th>
                  <th>Classification</th>
                  <th>Description of Expense</th>
                  <th>Fiscal Amount</th>
                  <th>Recipient</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id}>
                    <td><div className="timestamp-lux">{exp.expenseDate}</div></td>
                    <td><span className="category-pill-lux">{exp.category}</span></td>
                    <td><strong>{exp.description}</strong></td>
                    <td className="danger-text font-bold">₹{Number(exp.amount).toLocaleString()}</td>
                    <td>{exp.paidTo || '—'}</td>
                    <td>
                      <div className="flex-actions">
                        <button className="btn-icon-lux ghost" onClick={() => { setEditItem(exp); setForm({...exp}); setShowModal(true); }}><Edit3 size={14} /></button>
                        <button className="btn-icon-lux danger" onClick={async () => { if(confirm('Delete record?')) { await deleteExpense(exp.id); loadData(); } }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal glass-static" initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} onClick={e => e.stopPropagation()}>
              <h2>{editItem ? 'Edit Expenditure' : 'Record Transaction'}</h2>
              <form onSubmit={handleSubmit} className="premium-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                      <option value="">Select Category</option>
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount (₹)</label>
                    <input type="number" className="form-control" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label>Expense Date</label>
                    <input type="date" className="form-control" value={form.expenseDate} onChange={e => setForm({...form, expenseDate: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Paid To / Vendor</label>
                    <input className="form-control" value={form.paidTo} onChange={e => setForm({...form, paidTo: e.target.value})} placeholder="e.g. Electric Board, Staff Name" />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <input className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                  </div>
                </div>
                <div className="modal-footer-lux">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editItem ? 'Update Ledger' : 'Confirm Entry'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
