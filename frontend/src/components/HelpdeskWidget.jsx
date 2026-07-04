import React, { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { faqService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpdeskWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && faqs.length === 0) {
      fetchFaqs();
    }
  }, [isOpen]);

  const fetchFaqs = async (searchTerm = '') => {
    setLoading(true);
    try {
      const res = await faqService.getAll({ search: searchTerm });
      setFaqs(res.data.data || []);
    } catch (error) {
      console.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    // Debounce this in a real app
    setTimeout(() => {
      fetchFaqs(e.target.value);
    }, 500);
  };

  const categories = [...new Set(faqs.map(faq => faq.category))].filter(Boolean);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .helpdesk-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gov-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(0, 80, 138, 0.4);
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s ease;
          border: none;
        }
        .helpdesk-btn:hover {
          transform: scale(1.05);
          background: #004070;
        }
        .helpdesk-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.2);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .helpdesk-header {
          background: var(--gov-navy);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .helpdesk-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f8fafc;
        }
        .faq-item {
          background: white;
          border-radius: 8px;
          margin-bottom: 10px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .faq-question {
          padding: 12px 16px;
          font-weight: 600;
          font-size: 14px;
          color: var(--gov-navy);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: white;
        }
        .faq-answer {
          padding: 0 16px 16px;
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }
        .search-box {
          position: relative;
          margin-bottom: 16px;
        }
        .search-box input {
          width: 100%;
          padding: 10px 10px 10px 36px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }
        .search-box input:focus {
          border-color: var(--gov-blue);
        }
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
      `}} />

      <button className="helpdesk-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="helpdesk-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="helpdesk-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Gov Helpdesk</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd' }}>How can we help you today?</p>
              </div>
            </div>

            <div className="helpdesk-body">
              <div className="search-box">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  placeholder="Search FAQs..." 
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
              ) : faqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No FAQs found.</div>
              ) : (
                <>
                  {categories.map(category => (
                    <div key={category} style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '4px' }}>{category}</h4>
                      {faqs.filter(f => f.category === category).map(faq => (
                        <div className="faq-item" key={faq.id}>
                          <div 
                            className="faq-question"
                            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                          >
                            <span>{faq.question}</span>
                            {expandedId === faq.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                          <AnimatePresence>
                            {expandedId === faq.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div className="faq-answer">{faq.answer}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* FAQs without category */}
                  {faqs.filter(f => !f.category).map(faq => (
                    <div className="faq-item" key={faq.id}>
                      <div 
                        className="faq-question"
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        {expandedId === faq.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                      <AnimatePresence>
                        {expandedId === faq.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="faq-answer">{faq.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
