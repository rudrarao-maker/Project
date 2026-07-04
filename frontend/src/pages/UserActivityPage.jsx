import { useState, useEffect } from 'react';
import { userActivityService } from '../services/dataService';
import { Activity, Monitor, FileText, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const typeIcons = { application: <FileText size={16} />, document: <Monitor size={16} />, grievance: <AlertTriangle size={16} />, appointment: <Calendar size={16} /> };
const typeColors = { application: '#3b82f6', document: '#8b5cf6', grievance: '#ef4444', appointment: '#22c55e' };

export default function UserActivityPage() {
  const [tab, setTab] = useState('activity');
  const [activities, setActivities] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [aRes, lRes] = await Promise.all([userActivityService.getActivity(), userActivityService.getLoginHistory()]);
      setActivities(aRes.data.data.activities || []);
      setLoginHistory(lRes.data.data.history || []);
    } catch { toast.error('Failed to load activity'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="premium-dashboard flex-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Activity & History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Your account activity and login history</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['activity', 'logins'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: tab === t ? 'var(--accent-color, #3b82f6)' : 'transparent', color: tab === t ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            {t === 'activity' ? 'Activity Feed' : 'Login History'}
          </button>
        ))}
      </div>

      {tab === 'activity' && (
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}><Activity size={32} style={{ opacity: 0.3 }} /><p>No activity yet</p></div>
          ) : activities.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ paddingBottom: i === activities.length - 1 ? 0 : '24px', position: 'relative' }}>
              {i < activities.length - 1 && <div style={{ position: 'absolute', left: '-20px', top: '28px', width: '2px', height: 'calc(100% - 12px)', background: 'var(--border-color)' }} />}
              <div style={{ position: 'absolute', left: '-28px', top: '4px', width: '20px', height: '20px', borderRadius: '50%', background: typeColors[a.type] || '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {typeIcons[a.type] || <Activity size={10} />}
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{a.title}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: 'rgba(128,128,128,0.1)', color: 'var(--text-muted)' }}>{a.status?.replace(/_/g, ' ')}</span>
                </div>
                {a.subtitle && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{a.subtitle}</div>}
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {new Date(a.date).toLocaleString()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'logins' && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <table className="premium-table" style={{ width: '100%' }}>
            <thead><tr><th>Date & Time</th><th>IP Address</th><th>Device</th></tr></thead>
            <tbody>
              {loginHistory.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No login history</td></tr>
              ) : loginHistory.map((l, i) => (
                <tr key={i}>
                  <td>{new Date(l.loginAt).toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{l.ipAddress || 'N/A'}</td>
                  <td style={{ fontSize: '13px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.userAgent ? l.userAgent.substring(0, 60) + '...' : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
