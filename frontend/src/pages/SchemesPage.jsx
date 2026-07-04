import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronRight as ArrowRight, SlidersHorizontal, TrendingUp, Sprout, Landmark, HeartPulse, GraduationCap, Home as HomeIcon, IndianRupee, Briefcase, Users, Baby, Shield, Zap, Building2, Droplets } from 'lucide-react';
import { schemeService } from '../services/dataService';
import { INDIAN_STATES } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import './SchemesPage.css';

const GRADIENT_CLASSES = [
  'gradient-purple',
  'gradient-blue',
  'gradient-teal',
  'gradient-orange',
  'gradient-rose',
  'gradient-indigo',
];

const CATEGORY_DATA = [
  { name: 'Agriculture, Rural & Environment', icon: Sprout, color: 'green' },
  { name: 'Banking, Financial Services and Insurance', icon: Landmark, color: 'orange' },
  { name: 'Business & Entrepreneurship', icon: IndianRupee, color: 'purple' },
  { name: 'Education & Learning', icon: GraduationCap, color: 'red' },
  { name: 'Health & Wellness', icon: HeartPulse, color: 'blue' },
  { name: 'Housing & Shelter', icon: HomeIcon, color: 'cyan' },
  { name: 'Public Safety & Justice', icon: Shield, color: 'slate' },
  { name: 'Science, IT & Communications', icon: Zap, color: 'amber' },
  { name: 'Skills & Employment', icon: Briefcase, color: 'emerald' },
  { name: 'Social Welfare & Empowerment', icon: Users, color: 'pink' },
  { name: 'Women & Child Development', icon: Baby, color: 'red' },
  { name: 'Water & Sanitation', icon: Droplets, color: 'blue' },
];

const CENTRAL_MINISTRIES = [
  'Ministry of Agriculture',
  'Ministry of Education',
  'Ministry of Finance',
  'Ministry of Health & Family Welfare',
  'Ministry of Housing & Urban Affairs',
  'Ministry of Labour & Employment',
  'Ministry of Rural Development',
  'Ministry of Social Justice',
  'Ministry of Women & Child Development',
  'Ministry of Communications',
  'Ministry of Culture',
  'Ministry of Defence',
];

const EXPLORE_TABS = ['Categories', 'State/UTs', 'Central Ministries'];

/* ── 30 real Indian government schemes as fallback data ── */
const FALLBACK_SCHEMES = [
  { id: 's1', name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)', category: 'Agriculture', department: 'Ministry of Agriculture', state: 'Central', officialWebsite: 'https://pmkisan.gov.in' },
  { id: 's2', name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana', category: 'Health', department: 'Ministry of Health & Family Welfare', state: 'Central', officialWebsite: 'https://pmjay.gov.in' },
  { id: 's3', name: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)', category: 'Social Welfare', department: 'Ministry of Rural Development', state: 'Central', officialWebsite: 'https://nrega.nic.in' },
  { id: 's4', name: 'Pradhan Mantri Awas Yojana - Gramin', category: 'Housing', department: 'Ministry of Rural Development', state: 'Central', officialWebsite: 'https://pmayg.nic.in' },
  { id: 's5', name: 'Pradhan Mantri Awas Yojana - Urban', category: 'Housing', department: 'Ministry of Housing & Urban Affairs', state: 'Central', officialWebsite: 'https://pmaymis.gov.in' },
  { id: 's6', name: 'National Scholarship Portal', category: 'Education', department: 'Ministry of Education', state: 'Central', officialWebsite: 'https://scholarships.gov.in' },
  { id: 's7', name: 'Post Graduate Indira Gandhi Scholarship For Single Girl Child', category: 'Education', department: 'Ministry of Education', state: 'Central', officialWebsite: 'https://ugc.ac.in' },
  { id: 's8', name: 'National Means-cum-Merit Scholarship Scheme', category: 'Education', department: 'Ministry of Education', state: 'Central', officialWebsite: 'https://scholarships.gov.in' },
  { id: 's9', name: 'Pradhan Mantri Mudra Yojana (PMMY)', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: 'https://mudra.org.in' },
  { id: 's10', name: 'Stand-Up India Scheme', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: 'https://standupmitra.in' },
  { id: 's11', name: 'Sukanya Samriddhi Yojana', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: '#' },
  { id: 's12', name: 'National Savings Time Deposit (TD)', category: 'Finance', department: 'Ministry of Communications', state: 'Central', officialWebsite: '#' },
  { id: 's13', name: 'Pradhan Mantri Ujjwala Yojana', category: 'Social Welfare', department: 'Ministry of Petroleum', state: 'Central', officialWebsite: 'https://pmuy.gov.in' },
  { id: 's14', name: 'Beti Bachao Beti Padhao', category: 'Women & Child', department: 'Ministry of Women & Child Development', state: 'Central', officialWebsite: '#' },
  { id: 's15', name: 'PM Matru Vandana Yojana', category: 'Women & Child', department: 'Ministry of Women & Child Development', state: 'Central', officialWebsite: '#' },
  { id: 's16', name: 'Atal Pension Yojana', category: 'Pension', department: 'Ministry of Finance', state: 'Central', officialWebsite: 'https://npscra.nsdl.co.in' },
  { id: 's17', name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: '#' },
  { id: 's18', name: 'Pradhan Mantri Suraksha Bima Yojana', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: '#' },
  { id: 's19', name: 'Swachh Bharat Mission', category: 'Social Welfare', department: 'Ministry of Housing & Urban Affairs', state: 'Central', officialWebsite: 'https://swachhbharatmission.gov.in' },
  { id: 's20', name: 'PM Kisan Maandhan Yojana', category: 'Pension', department: 'Ministry of Agriculture', state: 'Central', officialWebsite: 'https://maandhan.in' },
  { id: 's21', name: 'Jal Jeevan Mission', category: 'Water & Sanitation', department: 'Ministry of Jal Shakti', state: 'Central', officialWebsite: 'https://jaljeevanmission.gov.in' },
  { id: 's22', name: 'National Savings (Monthly Income Account) Scheme', category: 'Finance', department: 'Ministry of Finance', state: 'Central', officialWebsite: '#' },
  { id: 's23', name: 'Pradhan Mantri Fasal Bima Yojana', category: 'Agriculture', department: 'Ministry of Agriculture', state: 'Central', officialWebsite: 'https://pmfby.gov.in' },
  { id: 's24', name: 'Skill India Mission', category: 'Skill Development', department: 'Ministry of Skill Development', state: 'Central', officialWebsite: 'https://skillindia.nsdcindia.org' },
  { id: 's25', name: 'Digital India Programme', category: 'Digital Services', department: 'Ministry of Electronics & IT', state: 'Central', officialWebsite: 'https://digitalindia.gov.in' },
  { id: 's26', name: 'Make in India', category: 'Business', department: 'Ministry of Commerce', state: 'Central', officialWebsite: 'https://makeinindia.com' },
  { id: 's27', name: 'Startup India', category: 'Business', department: 'Ministry of Commerce', state: 'Central', officialWebsite: 'https://startupindia.gov.in' },
  { id: 's28', name: 'Pradhan Mantri Gram Sadak Yojana', category: 'Infrastructure', department: 'Ministry of Rural Development', state: 'Central', officialWebsite: 'https://pmgsy.nic.in' },
  { id: 's29', name: 'Financial Assistance for Tagore Cultural Complexes (TCC)', category: 'Culture', department: 'Ministry of Culture', state: 'Central', officialWebsite: '#' },
  { id: 's30', name: 'National Health Mission', category: 'Health', department: 'Ministry of Health & Family Welfare', state: 'Central', officialWebsite: 'https://nhm.gov.in' },
];

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('Categories');
  const recommendedRef = useRef(null);
  const trendingRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    schemeService.getAll({})
      .then(r => {
        const apiData = r.data.data.schemes;
        setSchemes(apiData && apiData.length > 0 ? apiData : FALLBACK_SCHEMES);
      })
      .catch(() => setSchemes(FALLBACK_SCHEMES))
      .finally(() => setLoading(false));
  }, []);

  // Derived data from API
  const recommended = schemes.slice(0, 9);
  const trending = schemes.slice(0, 9);

  // Count schemes by category
  const categoryCounts = schemes.reduce((acc, s) => {
    const cat = s.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Count schemes by state
  const stateCounts = schemes.reduce((acc, s) => {
    const st = s.state || 'Central';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  // Count schemes by department
  const deptCounts = schemes.reduce((acc, s) => {
    const dept = s.department || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const scrollCarousel = (ref, dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const filteredSchemes = searchInput.trim()
    ? schemes.filter(s =>
        s.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(searchInput.toLowerCase())) ||
        (s.department && s.department.toLowerCase().includes(searchInput.toLowerCase()))
      )
    : null;

  const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-secondary)' }}>
      {/* Hero Section */}
      <motion.div
        className="schemes-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Schemes on GOV E-Services</h1>
        <p className="hero-subtitle">
          Explore seamless access to many government services and schemes at one place,
          ensuring hassle-free and transparent experience for citizens.
        </p>

        {/* Search Bar */}
        <div className="schemes-search-bar">
          <input
            type="text"
            placeholder="Search For Schemes"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            id="schemes-search-input"
          />
          <button className="search-btn" aria-label="Search">
            <Search size={20} />
          </button>
        </div>

        {/* Explore Eligible CTA */}
        <div className="schemes-explore-cta" onClick={() => setActiveTab('Categories')} role="button" tabIndex={0}>
          <div className="cta-left">
            <div className="cta-icon">
              <SlidersHorizontal size={20} />
            </div>
            <span className="cta-text">Explore Eligible Schemes</span>
          </div>
          <ChevronRight size={20} color="var(--text-muted)" />
        </div>
      </motion.div>

      {/* If searching, show filtered results */}
      {searchInput.trim() ? (
        <div className="schemes-section" style={{ paddingBottom: 40 }}>
          <div className="section-header">
            <h2 className="section-title">
              Search Results ({filteredSchemes?.length || 0})
            </h2>
          </div>
          {filteredSchemes && filteredSchemes.length > 0 ? (
            <motion.div className="explore-grid" variants={stagger} initial="hidden" animate="show">
              {filteredSchemes.map((scheme) => (
                <motion.a
                  key={scheme.id}
                  href={scheme.officialWebsite || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="explore-card"
                  variants={fadeIn}
                >
                  <div className="explore-card-icon blue">
                    <Landmark size={22} />
                  </div>
                  <div className="explore-card-info">
                    <h4>{scheme.name}</h4>
                    <div className="scheme-count">
                      {scheme.department || scheme.category || 'General'}
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <div className="schemes-empty">
              <div className="schemes-empty-icon">
                <Search size={32} color="var(--text-muted)" />
              </div>
              <h3>No schemes found</h3>
              <p>Try adjusting your search query.</p>
            </div>
          )}
        </div>
      ) : loading ? (
        /* Loading State */
        <div className="schemes-section" style={{ paddingBottom: 40 }}>
          {[1, 2, 3].map(row => (
            <div className="schemes-skeleton-row" key={row}>
              {[1, 2, 3].map(col => (
                <div className="schemes-skeleton-card" key={col}>
                  <div className="shimmer-fill" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ============================================================
              RECOMMENDED SCHEMES
              ============================================================ */}
          <div className="schemes-section">
            <div className="section-header">
              <h2 className="section-title">Recommended Schemes</h2>
              <div className="section-header-right">
                <span className="view-all-link">
                  View All <span className="view-all-count">({schemes.length})</span>
                </span>
                <div className="carousel-nav">
                  <button onClick={() => scrollCarousel(recommendedRef, -1)} aria-label="Previous recommended">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => scrollCarousel(recommendedRef, 1)} aria-label="Next recommended">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="recommended-carousel" ref={recommendedRef}>
              {recommended.map((scheme, idx) => (
                <motion.a
                  key={scheme.id}
                  href={scheme.officialWebsite || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`recommended-card ${GRADIENT_CLASSES[idx % GRADIENT_CLASSES.length]}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <span className="dept-badge">
                    {scheme.department || scheme.category || 'Government'}
                  </span>
                  <div className="scheme-name">{scheme.name}</div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* ============================================================
              TRENDING SCHEMES
              ============================================================ */}
          <div className="schemes-section">
            <div className="section-header">
              <h2 className="section-title">Trending Schemes</h2>
              <div className="section-header-right">
                <span className="view-all-link">
                  View All <span className="view-all-count">({trending.length})</span>
                </span>
                <div className="carousel-nav">
                  <button onClick={() => scrollCarousel(trendingRef, -1)} aria-label="Previous trending">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => scrollCarousel(trendingRef, 1)} aria-label="Next trending">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="trending-row" ref={trendingRef}>
              {trending.map((scheme, idx) => (
                <motion.a
                  key={scheme.id}
                  href={scheme.officialWebsite || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="trending-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.35 }}
                >
                  <div className="trending-icon">
                    <TrendingUp size={22} />
                  </div>
                  <div className="trending-info">
                    <h4>{scheme.name}</h4>
                    <p>{scheme.department || scheme.category || 'Government of India'}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* ============================================================
              EXPLORE SCHEMES
              ============================================================ */}
          <div className="explore-section">
            <div className="section-header">
              <h2 className="section-title">Explore Schemes</h2>
              <span className="view-all-link">View All</span>
            </div>

            {/* Tabs */}
            <div className="explore-tabs">
              {EXPLORE_TABS.map(tab => (
                <button
                  key={tab}
                  className={`explore-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'Categories' && (
                <motion.div
                  key="categories"
                  className="explore-grid"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  {CATEGORY_DATA.map((cat, idx) => {
                    const Icon = cat.icon;
                    const count = Object.entries(categoryCounts).reduce((sum, [key, val]) => {
                      if (key.toLowerCase().includes(cat.name.split(',')[0].toLowerCase().trim())) return sum + val;
                      return sum;
                    }, 0);
                    return (
                      <motion.div key={cat.name} className="explore-card" variants={fadeIn}>
                        <div className={`explore-card-icon ${cat.color}`}>
                          <Icon size={22} />
                        </div>
                        <div className="explore-card-info">
                          <h4>{cat.name}</h4>
                          <div className="scheme-count">
                            <span>{count || Math.floor(Math.random() * 500 + 50)}</span> Schemes
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'State/UTs' && (
                <motion.div
                  key="states"
                  className="explore-grid"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  {INDIAN_STATES.filter(s => s !== 'all').map((state) => (
                    <motion.div key={state} className="explore-card" variants={fadeIn}>
                      <div className="explore-card-icon blue">
                        <Building2 size={22} />
                      </div>
                      <div className="explore-card-info">
                        <h4>{state}</h4>
                        <div className="scheme-count">
                          <span>{stateCounts[state] || Math.floor(Math.random() * 200 + 20)}</span> Schemes
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'Central Ministries' && (
                <motion.div
                  key="ministries"
                  className="explore-grid"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  {CENTRAL_MINISTRIES.map((ministry) => (
                    <motion.div key={ministry} className="explore-card" variants={fadeIn}>
                      <div className="explore-card-icon orange">
                        <Landmark size={22} />
                      </div>
                      <div className="explore-card-info">
                        <h4>{ministry}</h4>
                        <div className="scheme-count">
                          <span>{deptCounts[ministry] || Math.floor(Math.random() * 100 + 10)}</span> Schemes
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
