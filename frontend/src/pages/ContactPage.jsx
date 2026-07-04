import React, { useState } from 'react';
import { publicService } from '../services/dataService';
import toast from 'react-hot-toast';
import { MapPin, Mail, Phone, Send, HelpCircle, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import './ProfileSettings.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await publicService.submitContact(formData);
      toast.success('Your support request has been submitted. We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="profile-settings-page">
      <motion.div 
        className="page-header text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle mb-6 max-w-2xl mx-auto">
          Need assistance with a government service? Our dedicated support team is here to help you every step of the way.
        </p>
        
        {/* Global Search Bar Alternative for Helpdesk */}
        <div className="flex-center w-full mb-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input 
              type="text" 
              className="premium-input w-full pl-12" 
              placeholder="Search for articles, FAQs, or services... (or press Ctrl+K)"
              style={{ height: 56, fontSize: 16, borderRadius: 28 }}
            />
          </div>
        </div>
      </motion.div>

      <div className="settings-layout">
        <motion.div 
          className="settings-sidebar"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeInUp} className="glass-container p-6 mb-6 bg-gradient-to-br from-blue-900 to-blue-700 text-white border-0" style={{ background: 'linear-gradient(135deg, #00508a, #002244)' }}>
            <h3 className="text-xl font-bold mb-6 text-white">Contact Information</h3>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-full shrink-0"><Phone size={20} /></div>
              <div>
                <h4 className="font-semibold text-white/80 text-sm">Toll-Free Helpline</h4>
                <p className="text-lg font-bold text-white">1800-111-555</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-full shrink-0"><Mail size={20} /></div>
              <div>
                <h4 className="font-semibold text-white/80 text-sm">Email Support</h4>
                <p className="font-bold text-white">support@india.gov.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full shrink-0"><MapPin size={20} /></div>
              <div>
                <h4 className="font-semibold text-white/80 text-sm">Head Office</h4>
                <p className="text-white text-sm leading-relaxed">
                  National Informatics Centre,<br />
                  A-Block, CGO Complex,<br />
                  Lodhi Road, New Delhi
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-container p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-gov-blue" /> Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gov-blue hover:underline text-sm font-semibold flex items-center gap-2"><FileText size={14}/> Frequently Asked Questions</a></li>
              <li><a href="#" className="text-gov-blue hover:underline text-sm font-semibold flex items-center gap-2"><FileText size={14}/> Grievance Redressal</a></li>
              <li><a href="#" className="text-gov-blue hover:underline text-sm font-semibold flex items-center gap-2"><FileText size={14}/> Track Support Ticket</a></li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="settings-content glass-container p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gov-blue flex items-center gap-3">
            <Send size={24} /> Submit a Request
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input 
                  type="email" 
                  className="premium-input" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="premium-input" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Subject *</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>
            </div>

            <div className="input-group mb-6">
              <label className="input-label">Description *</label>
              <textarea 
                className="premium-input" 
                style={{ height: '150px', paddingTop: '16px', resize: 'vertical' }}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Describe your issue or query in detail..."
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-solid-blue px-8 py-3 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
