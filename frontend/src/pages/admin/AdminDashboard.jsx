import React, { useState, useEffect } from 'react';
import { adminService, authService } from '../../services/dataService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, FileText, Clock, IndianRupee, RefreshCw, BarChart3, Activity, ShieldCheck, X, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2FA State
  const [show2FA, setShow2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const res = await authService.setup2FA();
      setQrCodeUrl(res.data.data.qrCodeUrl);
      setSetupSecret(res.data.data.secret);
      setShow2FA(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate 2FA setup');
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!token2FA) return;
    try {
      setIsVerifying(true);
      const res = await authService.verify2FASetup({ token: token2FA });
      toast.success(res.data.message || '2FA Enabled');
      setShow2FA(false);
      setToken2FA('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setIsVerifying(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || !stats.recentActivity) return;
    
    // Create CSV content
    const headers = ['User', 'Service', 'Status', 'Date'];
    const csvRows = [
      headers.join(','),
      ...stats.recentActivity.map(act => [
        `"${act.userName}"`,
        `"${act.serviceName}"`,
        `"${act.status}"`,
        `"${new Date(act.createdAt).toISOString()}"`
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exported successfully');
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading || !stats) {
    return (
      <div className="premium-dashboard flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const { overview, monthlyData, recentActivity, topServices, statusDistribution } = stats;

  const applicationsChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Applications',
        data: monthlyData.map(d => d.applications),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'New Users',
        data: monthlyData.map(d => d.users),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true
      }
    ],
  };

  const statusChartData = {
    labels: ['Pending', 'Approved', 'Rejected', 'In Progress'],
    datasets: [
      {
        data: [
          statusDistribution.pending,
          statusDistribution.approved,
          statusDistribution.rejected,
          statusDistribution.in_progress
        ],
        backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const servicesChartData = {
    labels: topServices.map(s => s.name.length > 20 ? s.name.substring(0, 20) + '...' : s.name),
    datasets: [
      {
        label: 'Applications per Service',
        data: topServices.map(s => s.count),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderRadius: 4
      },
    ],
  };

  return (
    <div className="premium-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Platform overview and real-time statistics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="btn-outline-glow text-blue-500 border-blue-500">
            <Download size={18} /> Export CSV
          </button>
          <button onClick={handleSetup2FA} className="btn-outline-glow text-green-500 border-green-500">
            <ShieldCheck size={18} /> Enable 2FA
          </button>
          <button onClick={fetchDashboardStats} className="btn-outline-glow">
            <RefreshCw size={18} /> Refresh Data
          </button>
        </div>
      </motion.div>

      {/* 2FA Setup Modal */}
      {show2FA && (
        <div className="fixed inset-0 bg-black/60 z-50 flex-center" onClick={() => setShow2FA(false)}>
          <div className="bg-white p-8 rounded-xl max-w-md w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={() => setShow2FA(false)}>
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-2">Set Up Two-Factor Authentication</h2>
            <p className="text-gray-500 text-sm mb-6">Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code below to verify.</p>
            
            <div className="flex justify-center mb-6">
              {qrCodeUrl ? <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 border rounded-lg" /> : <div className="spinner"></div>}
            </div>
            
            <form onSubmit={handleVerify2FA} className="flex gap-3">
              <input 
                type="text" 
                maxLength="6"
                placeholder="000000" 
                className="premium-input flex-1 text-center text-xl tracking-widest font-bold"
                value={token2FA}
                onChange={e => setToken2FA(e.target.value.replace(/\D/g, ''))}
              />
              <button type="submit" disabled={isVerifying || token2FA.length !== 6} className="btn-solid-blue px-6">
                Verify
              </button>
            </form>
          </div>
        </div>
      )}

      <motion.div 
        className="dashboard-stats-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper blue"><Users size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{overview.totalUsers.toLocaleString()}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper purple"><FileText size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{overview.totalApplications.toLocaleString()}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper orange"><Clock size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{overview.pendingApplications.toLocaleString()}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper green"><IndianRupee size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">₹{overview.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Revenue Generated</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-main-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp} className="dashboard-panel mb-6">
          <div className="panel-header">
            <h2 className="panel-title"><Activity size={20} className="text-gov-blue" /> Growth Trends (6 Months)</h2>
          </div>
          <div className="panel-body" style={{ height: '350px' }}>
            <Line data={applicationsChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="dashboard-panel mb-6">
          <div className="panel-header">
            <h2 className="panel-title"><BarChart3 size={20} className="text-gov-blue" /> Application Status</h2>
          </div>
          <div className="panel-body flex-center" style={{ height: '350px' }}>
            <div style={{ width: '80%', height: '80%' }}>
              <Doughnut data={statusChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="dashboard-main-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp} className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title"><BarChart3 size={20} className="text-gov-blue" /> Top Services</h2>
          </div>
          <div className="panel-body" style={{ height: '350px' }}>
            <Bar data={servicesChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title"><Clock size={20} className="text-gov-blue" /> Recent Activity</h2>
          </div>
          <div className="premium-table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((act, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{act.userName}</td>
                    <td>{act.serviceName.length > 20 ? act.serviceName.substring(0, 20) + '...' : act.serviceName}</td>
                    <td>
                      <span className={`status-badge ${act.status === 'approved' ? 'approved' : act.status === 'rejected' ? 'rejected' : 'pending'}`}>
                        {act.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
