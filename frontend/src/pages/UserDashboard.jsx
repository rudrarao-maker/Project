import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationService, documentService, notificationService, paymentService } from '../services/dataService';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, Bell, Settings, ArrowRight, FolderOpen, Inbox, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function UserDashboard() {
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appsRes, docsRes, notifsRes] = await Promise.all([
        applicationService.getAll(),
        documentService.getAll(),
        notificationService.getAll()
      ]);
      
      setApplications(appsRes.data.data.applications || []);
      setDocuments(docsRes.data.data.documents || []);
      setNotifications(notifsRes.data.data.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const approvedApps = applications.filter(a => a.status === 'approved');
  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'in_progress');
  const unreadNotifs = notifications.filter(n => !n.isRead);

  const handleDownloadReceipt = async (app) => {
    try {
      const res = await paymentService.downloadReceipt(app.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${app.applicationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download receipt or payment not complete');
    }
  };

  // Animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="premium-dashboard flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="dashboard-subtitle">Here is your digital portal overview for today.</p>
        </div>
        <Link to="/settings" className="btn-outline-glow">
          <Settings size={18} /> Settings
        </Link>
      </motion.div>

      <motion.div 
        className="dashboard-stats-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper blue"><FileText size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper green"><CheckCircle2 size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{approvedApps.length}</div>
            <div className="stat-label">Approved</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper orange"><Clock size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{pendingApps.length}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="stat-card">
          <div className="stat-icon-wrapper purple"><Bell size={28} /></div>
          <div className="stat-content">
            <div className="stat-value">{unreadNotifs.length}</div>
            <div className="stat-label">Unread Alerts</div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-main-grid">
        {/* Left Column */}
        <motion.div 
          className="dashboard-left"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Applications Table */}
          <motion.div variants={fadeInUp} className="dashboard-panel mb-6">
            <div className="panel-header">
              <h2 className="panel-title"><FileText size={20} className="text-gov-blue" /> Recent Applications</h2>
              <Link to="/services" className="btn-solid-blue" style={{ padding: '8px 16px', fontSize: '13px' }}>
                New Application
              </Link>
            </div>
            
            <div className="premium-table-wrapper">
              {applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><FolderOpen size={32} /></div>
                  <h3>No Applications Yet</h3>
                  <p>Apply for government schemes and services to see them here.</p>
                </div>
              ) : (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Service Name</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.applicationNumber}</td>
                        <td>{app.service?.name || 'Standard Service'}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${app.status === 'approved' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'pending'}`}>
                            {app.status === 'approved' && <CheckCircle2 size={12} />}
                            {app.status === 'pending' && <Clock size={12} />}
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          {(app.status === 'approved' || app.status === 'payment_completed') && (
                            <button onClick={() => handleDownloadReceipt(app)} className="btn-outline-glow" style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Download size={12} /> Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column */}
        <motion.div 
          className="dashboard-right"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Notifications Panel */}
          <motion.div variants={fadeInUp} className="dashboard-panel">
            <div className="panel-header">
              <h2 className="panel-title"><Bell size={20} className="text-gov-blue" /> Notifications</h2>
              {unreadNotifs.length > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="notification-list" style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon" style={{ width: 64, height: 64 }}><Inbox size={24} /></div>
                  <h3>All caught up</h3>
                  <p>You have no new notifications.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${!notif.isRead ? 'notif-unread' : ''}`}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                  >
                    <div className="notif-icon"><Bell size={18} /></div>
                    <div className="notif-content">
                      <div className="notif-title">{notif.subject}</div>
                      <div className="notif-desc">{notif.message}</div>
                      <div className="notif-time">{new Date(notif.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid rgba(128,128,128,0.1)' }}>
                <Link to="#" style={{ color: '#00508a', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>View All Notifications</Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
