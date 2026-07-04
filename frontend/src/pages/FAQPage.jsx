import { useState, useEffect } from 'react';
import { faqService } from '../services/dataService';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    faqService.getAll().then(res => setFaqs(res.data.data.faqs || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(faqs.map(f => f.category).filter(Boolean))];
  const filtered = faqs.filter(f => {
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="premium-dashboard flex-center"><div className="spinner"></div></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Find answers to common questions about our services</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '15px', color: 'var(--text-primary)' }} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', background: activeCategory === c ? 'var(--accent-color, #3b82f6)' : 'transparent', color: activeCategory === c ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <HelpCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3>No FAQs found</h3>
          <p>Try a different search term or category</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {filtered.map(faq => (
            <motion.div key={faq.id} layout style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} style={{ width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', flex: 1 }}>{faq.question}</span>
                {openId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div style={{ padding: '0 20px 16px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
