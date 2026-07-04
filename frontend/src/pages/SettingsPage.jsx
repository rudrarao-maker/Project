import React, { useState } from 'react';
import { Shield, Bell, Moon, User, Lock, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../store/themeStore';
import './ProfileSettings.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const { theme, toggleTheme } = useTheme();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  return (
    <div className="profile-settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and system settings</p>
      </div>

      <div className="glass-container settings-layout p-6">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={18} /> Account Details
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Security & Password
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Moon size={18} /> Appearance
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          
          {activeTab === 'account' && (
            <form onSubmit={handleSave}>
              <h2 className="mb-6 text-xl font-bold">Account Preferences</h2>
              <div className="input-group mb-4">
                <label className="input-label">Language Preference</label>
                <select className="premium-input">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>
              <div className="input-group mb-6">
                <label className="input-label">Timezone</label>
                <select className="premium-input">
                  <option value="IST">Indian Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
              <button type="submit" className="btn-solid-blue">Update Preferences</button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave}>
              <h2 className="mb-6 text-xl font-bold">Security Settings</h2>
              <div className="input-group mb-4">
                <label className="input-label">Current Password</label>
                <input type="password" className="premium-input" placeholder="••••••••" />
              </div>
              <div className="input-group mb-4">
                <label className="input-label">New Password</label>
                <input type="password" className="premium-input" placeholder="Min 8 characters" />
              </div>
              <div className="input-group mb-6">
                <label className="input-label">Confirm New Password</label>
                <input type="password" className="premium-input" placeholder="Min 8 characters" />
              </div>
              <button type="submit" className="btn-solid-blue">Change Password</button>
              
              <hr className="my-6" style={{ borderColor: 'rgba(128,128,128,0.1)' }} />
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted">Add an extra layer of security to your account.</p>
                </div>
                <button type="button" className="btn-outline-glow">Enable 2FA</button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 className="mb-6 text-xl font-bold">Appearance Settings</h2>
              <div className="flex items-center justify-between p-4 mb-4" style={{ background: 'rgba(128,128,128,0.02)', borderRadius: 12, border: '1px solid rgba(128,128,128,0.1)' }}>
                <div>
                  <h4 className="font-bold flex items-center gap-2"><Moon size={16} /> Dark Mode</h4>
                  <p className="text-sm text-muted">Toggle between light and dark themes.</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="btn-solid-blue"
                  style={{ background: theme === 'dark' ? '#10b981' : '#3b82f6' }}
                >
                  {theme === 'dark' ? 'Enabled' : 'Enable Dark Mode'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave}>
              <h2 className="mb-6 text-xl font-bold">Notification Preferences</h2>
              
              <div className="flex items-center justify-between p-4 mb-3 border-b" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
                <div>
                  <h4 className="font-bold flex items-center gap-2"><Mail size={16} /> Email Alerts</h4>
                  <p className="text-sm text-muted">Receive application status updates via email.</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#3b82f6' }} />
              </div>

              <div className="flex items-center justify-between p-4 mb-6 border-b" style={{ borderColor: 'rgba(128,128,128,0.1)' }}>
                <div>
                  <h4 className="font-bold flex items-center gap-2"><Smartphone size={16} /> SMS Alerts</h4>
                  <p className="text-sm text-muted">Receive OTPs and critical alerts via SMS.</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: '#3b82f6' }} />
              </div>

              <button type="submit" className="btn-solid-blue">Save Preferences</button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
