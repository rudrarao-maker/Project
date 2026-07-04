import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PlaceholderPage() {
  const location = useLocation();
  
  // Create a readable title from the path
  const pathName = location.pathname.replace('/', '').replace(/-/g, ' ');
  const title = pathName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="profile-settings-page" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="glass-container p-8 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="page-title mb-4">{title || 'Page Not Found'}</h1>
        <div className="section-divider mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg mb-8">
          This page is currently under construction. 
          The content for <strong>{title}</strong> will be available soon as part of the Digital India initiative.
        </p>
        
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
          For urgent queries, please visit our <a href="/contact" className="text-blue-600 font-bold hover:underline">Contact Us</a> page or use the National Consumer Helpline.
        </div>
      </motion.div>
    </div>
  );
}
