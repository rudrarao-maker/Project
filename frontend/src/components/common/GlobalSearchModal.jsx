import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchService } from '../../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.length < 2) return;
    setLoading(true);
    try {
      const res = await searchService.search({ q: query });
      setResults(res.data.data);
    } catch {
      setResults({ services: [], schemes: [], jobs: [], faqs: [] });
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', padding: '40px 20px' }} onClick={onClose}>
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-primary)', width: '100%', maxWidth: '600px', maxHeight: '80vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services, schemes, jobs, or FAQs..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '18px', color: 'var(--text-primary)' }} />
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}><X size={20} /></button>
          </form>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {loading ? <div className="flex-center" style={{ height: '200px' }}><div className="spinner"></div></div> : !results ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Type at least 2 characters and press Enter to search</div>
            ) : results.totalResults === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>No results found for "{query}"</div>
            ) : (
              <div style={{ display: 'grid', gap: '24px' }}>
                {results.services.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Services</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {results.services.map(s => (
                        <div key={s.id} onClick={() => navigateTo(`/services/${s.id}`)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.category} • {s.department}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.schemes.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>Schemes</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {results.schemes.map(s => (
                        <div key={s.id} onClick={() => navigateTo(`/schemes/${s.id}`)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.category} • {s.state}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {results.faqs.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>FAQs</h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {results.faqs.map(f => (
                        <div key={f.id} onClick={() => navigateTo(`/faq`)} style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.question}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{f.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
