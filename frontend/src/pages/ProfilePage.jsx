import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, Phone, ShieldCheck, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import './ProfileSettings.css';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    bio: 'Digital Citizen of India',
    location: 'New Delhi, India',
    occupation: 'Software Engineer'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const activityLog = [
    { id: 1, title: 'Logged in successfully', date: 'Today at 10:30 AM' },
    { id: 2, title: 'Applied for Driving License Renewal', date: 'Yesterday at 4:15 PM' },
    { id: 3, title: 'Updated security preferences', date: 'Oct 24, 2025 at 9:00 AM' },
    { id: 4, title: 'Downloaded Aadhaar e-Copy', date: 'Oct 20, 2025 at 2:30 PM' }
  ];

  return (
    <div className="profile-settings-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal information and activity</p>
      </div>

      <div className="glass-container mb-6">
        <div className="profile-cover"></div>
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" className="profile-avatar-img" />
            <div className="profile-avatar-edit">
              <Camera size={16} />
            </div>
          </div>
          <div className="profile-info-header">
            <h2 className="profile-name">{formData.name || 'Citizen'}</h2>
            <div className="profile-role"><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} /> Verified Citizen</div>
          </div>
        </div>

        <form onSubmit={handleSave} className="settings-form border-t border-gray-100">
          <h3 className="mb-4 text-lg font-bold">Personal Information</h3>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input 
                type="text" 
                className="premium-input" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" 
                className="premium-input" 
                value={formData.email}
                disabled
              />
            </div>
            <div className="input-group">
              <label className="input-label">Mobile Number</label>
              <input 
                type="tel" 
                className="premium-input" 
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Location</label>
              <input 
                type="text" 
                className="premium-input" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Bio</label>
            <textarea 
              className="premium-input" 
              style={{ height: '100px', paddingTop: '12px', resize: 'none' }}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-solid-blue" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-container p-6">
        <h3 className="mb-4 text-lg font-bold">Recent Activity</h3>
        <div className="timeline">
          {activityLog.map((log) => (
            <div key={log.id} className="timeline-item">
              <div className="timeline-icon"></div>
              <div className="timeline-content">
                <div className="timeline-date">{log.date}</div>
                <div className="timeline-title">{log.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
