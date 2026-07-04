import { useState, useEffect } from 'react';
import { adminService } from '../../services/dataService';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../Dashboard.css';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ jobCode: '', title: '', department: '', state: '', category: '', qualification: '', ageLimit: '', deadline: '', salary: '', jobType: '', description: '', officialWebsite: '', logoUrl: '' });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => { try { const res = await adminService.getJobs({ search }); setJobs(res.data.data.jobs || []); } catch {} finally { setLoading(false); } };

  const handleSubmit = async (e) => { e.preventDefault(); try { if (editing) { await adminService.updateJob(editing.id, form); toast.success('Updated'); } else { await adminService.createJob(form); toast.success('Created'); } setShowModal(false); setEditing(null); fetchJobs(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const handleEdit = (j) => { setEditing(j); setForm({ ...j, deadline: j.deadline?.substring(0, 10) || '' }); setShowModal(true); };
  const handleDelete = async (id) => { if (!confirm('Deactivate?')) return; try { await adminService.deleteJob(id); toast.success('Deactivated'); fetchJobs(); } catch {} };

  return (
    <div className="premium-dashboard">
      <div className="dashboard-header"><div><h1 className="dashboard-title">Manage Jobs</h1><p className="dashboard-subtitle">Create and manage job listings</p></div>
        <button onClick={() => { setEditing(null); setForm({ jobCode: '', title: '', department: '', state: '', category: '', qualification: '', ageLimit: '', deadline: '', salary: '', jobType: '', description: '', officialWebsite: '', logoUrl: '' }); setShowModal(true); }} className="btn-solid-blue"><Plus size={18} /> Add Job</button>
      </div>
      <div style={{ marginBottom: '20px' }}><div style={{ position: 'relative', maxWidth: '400px' }}><Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} /><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchJobs()} placeholder="Search jobs..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div></div>

      {loading ? <div className="flex-center" style={{ padding: '60px' }}><div className="spinner"></div></div> : (
        <div className="dashboard-panel"><div className="premium-table-wrapper">
          <table className="premium-table"><thead><tr><th>Code</th><th>Title</th><th>Department</th><th>State</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{jobs.map(j => (<tr key={j.id}><td style={{ fontWeight: 600 }}>{j.jobCode}</td><td>{j.title}</td><td>{j.department}</td><td>{j.state}</td><td>{j.deadline ? new Date(j.deadline).toLocaleDateString() : '—'}</td><td><span className={`status-badge ${j.isActive ? 'approved' : 'rejected'}`}>{j.isActive ? 'active' : 'inactive'}</span></td><td><div style={{ display: 'flex', gap: '8px' }}><button onClick={() => handleEdit(j)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit2 size={16} /></button><button onClick={() => handleDelete(j.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button></div></td></tr>))}</tbody>
          </table>
        </div></div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-primary)', borderRadius: '16px', padding: '32px', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><h2>{editing ? 'Edit Job' : 'New Job'}</h2><button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[['jobCode', 'Job Code *'], ['title', 'Title *'], ['department', 'Department *'], ['state', 'State *'], ['category', 'Category'], ['salary', 'Salary'], ['ageLimit', 'Age Limit'], ['jobType', 'Job Type'], ['deadline', 'Deadline', 'date'], ['officialWebsite', 'Website'], ['logoUrl', 'Logo URL']].map(([key, label, type]) => (
                  <div key={key}><label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>{label}</label><input type={type || 'text'} value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} required={label.includes('*')} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} /></div>
                ))}
                {[['qualification', 'Qualification'], ['description', 'Description']].map(([key, label]) => (
                  <div key={key} style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>{label}</label><textarea rows={2} value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }} /></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}><button type="submit" className="btn-solid-blue">{editing ? 'Update' : 'Create'}</button><button type="button" onClick={() => setShowModal(false)} className="btn-outline-glow">Cancel</button></div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
