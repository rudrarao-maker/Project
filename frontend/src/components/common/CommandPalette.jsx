import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, FileText, Settings, Shield, HelpCircle, FileDigit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './CommandPalette.css';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  const commands = [
    { id: 'home', title: 'Home Page', desc: 'Return to the landing page', icon: <Home size={18} />, path: '/' },
    { id: 'dashboard', title: 'My Dashboard', desc: 'View your applications and analytics', icon: <FileText size={18} />, path: '/dashboard' },
    { id: 'services', title: 'Government Services', desc: 'Apply for central and state services', icon: <FileDigit size={18} />, path: '/services' },
    { id: 'settings', title: 'Account Settings', desc: 'Manage your preferences and security', icon: <Settings size={18} />, path: '/settings' },
    { id: 'profile', title: 'My Profile', desc: 'View and edit your citizen profile', icon: <Shield size={18} />, path: '/profile' },
    { id: 'support', title: 'Help & Support', desc: 'Contact helpdesk or view FAQs', icon: <HelpCircle size={18} />, path: '/contact' },
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="command-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            className="command-palette"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-search-header">
              <Search size={20} className="text-muted" />
              <input
                ref={inputRef}
                type="text"
                className="command-search-input"
                placeholder="Search services, pages, or settings..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="command-esc">ESC</span>
            </div>

            <div className="command-results">
              {filteredCommands.length > 0 ? (
                <>
                  <div className="command-group-title">Suggested Pages</div>
                  {filteredCommands.map((cmd) => (
                    <div 
                      key={cmd.id} 
                      className="command-item"
                      onClick={() => handleSelect(cmd.path)}
                    >
                      <div className="command-item-icon">{cmd.icon}</div>
                      <div className="command-item-content">
                        <div className="command-item-title" style={{ color: 'var(--text-primary)' }}>{cmd.title}</div>
                        <div className="command-item-desc">{cmd.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-6 text-center text-muted">No results found for "{query}"</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
