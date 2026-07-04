import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, CalendarDays, Briefcase, ClipboardList } from 'lucide-react';
import { jobService } from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import './JobsPage.css';

/* ── Fallback job data ── */
const FALLBACK_JOBS = [
  { id: 'j1', title: 'HelpDesk/Call Center/Grievance Assistant Manager', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'New Delhi', qualification: '2+ Years', deadline: '2026-07-13', officialWebsite: '#', salary: '₹4-6 LPA', jobType: 'Contract', description: 'DigiLocker' },
  { id: 'j2', title: 'HelpDesk/Call Center/Grievance Deputy Manager', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'New Delhi', qualification: '5+ Years', deadline: '2026-07-13', officialWebsite: '#', salary: '₹6-8 LPA', jobType: 'Contract', description: 'DigiLocker' },
  { id: 'j3', title: 'Business Analyst', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'New Delhi', qualification: '5-8 Years', deadline: '2026-07-15', officialWebsite: '#', salary: '₹8-12 LPA', jobType: 'Contract', description: 'AI-NeGD' },
  { id: 'j4', title: 'Data Engineer - Machine Learning', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'Remote', qualification: '4+ Years', deadline: '2026-07-05', officialWebsite: '#', salary: '₹10-15 LPA', jobType: 'Contract', description: 'MyScheme' },
  { id: 'j5', title: 'Full Stack Developer (AI & Web Applications)', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'New Delhi', qualification: '4+ Years', deadline: '2026-07-05', officialWebsite: '#', salary: '₹8-14 LPA', jobType: 'Contract', description: 'MyScheme' },
  { id: 'j6', title: 'Project Manager', department: 'National E-Governance Division(NeGD)', category: 'Administration', state: 'New Delhi', qualification: '7+ Years', deadline: '2026-07-04', officialWebsite: '#', salary: '₹12-18 LPA', jobType: 'Contract', description: 'BCAS2.0' },
  { id: 'j7', title: 'Senior Software Developer - Java', department: 'National Informatics Centre (NIC)', category: 'IT & Telecom', state: 'New Delhi', qualification: '5+ Years', deadline: '2026-07-20', officialWebsite: '#', salary: '₹10-16 LPA', jobType: 'Full-time' },
  { id: 'j8', title: 'UI/UX Designer', department: 'Digital India Corporation', category: 'IT & Telecom', state: 'Bengaluru', qualification: '3+ Years', deadline: '2026-07-18', officialWebsite: '#', salary: '₹6-10 LPA', jobType: 'Contract' },
  { id: 'j9', title: 'Database Administrator (DBA)', department: 'Ministry of Electronics & IT', category: 'IT & Telecom', state: 'New Delhi', qualification: '6+ Years', deadline: '2026-07-22', officialWebsite: '#', salary: '₹8-14 LPA', jobType: 'Full-time' },
  { id: 'j10', title: 'Cyber Security Analyst', department: 'CERT-In (Indian Computer Emergency Response Team)', category: 'IT & Telecom', state: 'New Delhi', qualification: '4+ Years', deadline: '2026-07-25', officialWebsite: '#', salary: '₹10-15 LPA', jobType: 'Full-time' },
  { id: 'j11', title: 'Content Writer - Hindi & English', department: 'MyGov Portal', category: 'Administration', state: 'New Delhi', qualification: '2+ Years', deadline: '2026-07-10', officialWebsite: '#', salary: '₹3-5 LPA', jobType: 'Contract' },
  { id: 'j12', title: 'DevOps Engineer', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'Hyderabad', qualification: '4+ Years', deadline: '2026-07-12', officialWebsite: '#', salary: '₹8-14 LPA', jobType: 'Contract', description: 'UMANG' },
  { id: 'j13', title: 'System Analyst', department: 'National Informatics Centre (NIC)', category: 'IT & Telecom', state: 'Mumbai', qualification: '5+ Years', deadline: '2026-07-28', officialWebsite: '#', salary: '₹7-12 LPA', jobType: 'Full-time' },
  { id: 'j14', title: 'Mobile Application Developer (React Native)', department: 'Digital India Corporation', category: 'IT & Telecom', state: 'Pune', qualification: '3+ Years', deadline: '2026-07-15', officialWebsite: '#', salary: '₹6-10 LPA', jobType: 'Contract' },
  { id: 'j15', title: 'District Programme Coordinator', department: 'Ministry of Rural Development', category: 'Administration', state: 'Multiple States', qualification: '8+ Years', deadline: '2026-07-30', officialWebsite: '#', salary: '₹6-9 LPA', jobType: 'Contract' },
  { id: 'j16', title: 'Research Associate - Public Policy', department: 'NITI Aayog', category: 'Education', state: 'New Delhi', qualification: '3+ Years', deadline: '2026-07-08', officialWebsite: '#', salary: '₹5-8 LPA', jobType: 'Contract' },
  { id: 'j17', title: 'Cloud Architect', department: 'MeitY Cloud (GovCloud)', category: 'IT & Telecom', state: 'New Delhi', qualification: '8+ Years', deadline: '2026-08-01', officialWebsite: '#', salary: '₹15-25 LPA', jobType: 'Full-time' },
  { id: 'j18', title: 'Quality Assurance Engineer', department: 'National E-Governance Division(NeGD)', category: 'IT & Telecom', state: 'New Delhi', qualification: '3+ Years', deadline: '2026-07-09', officialWebsite: '#', salary: '₹5-9 LPA', jobType: 'Contract', description: 'eHospital' },
];

const EXPERIENCE_OPTIONS = ['All Experience', '0-2 Years', '2-5 Years', '5-8 Years', '8+ Years'];
const DEPARTMENT_OPTIONS = ['All Departments', 'National E-Governance Division(NeGD)', 'National Informatics Centre (NIC)', 'Digital India Corporation', 'NITI Aayog', 'Ministry of Electronics & IT', 'Ministry of Rural Development', 'CERT-In'];
const LOCATION_OPTIONS = ['All Locations', 'New Delhi', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Remote', 'Multiple States'];

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [expFilter, setExpFilter] = useState('All Experience');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [locFilter, setLocFilter] = useState('All Locations');

  useEffect(() => {
    setLoading(true);
    jobService.getAll({
      search: search || undefined,
    })
      .then(res => {
        const apiData = res.data.data.jobs;
        setJobs(apiData && apiData.length > 0 ? apiData : FALLBACK_JOBS);
      })
      .catch(() => setJobs(FALLBACK_JOBS))
      .finally(() => setLoading(false));
  }, [search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Local filtering on the loaded data
  const filteredJobs = jobs.filter(job => {
    if (deptFilter !== 'All Departments' && job.department !== deptFilter) return false;
    if (locFilter !== 'All Locations' && job.state !== locFilter) return false;
    if (expFilter !== 'All Experience') {
      const qual = (job.qualification || job.ageLimit || '').toLowerCase();
      if (expFilter === '0-2 Years' && !qual.match(/[0-2]\+?\s*year/i) && !qual.includes('fresher')) return false;
      // simplified matching — show all if no strict match
    }
    return true;
  });

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-secondary)' }}>
      {/* Hero */}
      <motion.div
        className="jobs-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="jobs-hero-inner">
          <h1>Job Opportunities</h1>
          <p className="hero-subtitle">
            Explore job openings across government departments &amp; projects
          </p>

          <div className="jobs-controls">
            {/* Search */}
            <div className="jobs-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by job title, department, location"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                id="jobs-search-input"
              />
            </div>

            {/* Filter Pills */}
            <div className="jobs-filters">
              <select
                className={`filter-pill ${expFilter !== 'All Experience' ? 'active-filter' : ''}`}
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                id="jobs-exp-filter"
              >
                {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o === 'All Experience' ? 'Experience' : o}</option>)}
              </select>

              <select
                className={`filter-pill ${deptFilter !== 'All Departments' ? 'active-filter' : ''}`}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                id="jobs-dept-filter"
              >
                {DEPARTMENT_OPTIONS.map(o => <option key={o} value={o}>{o === 'All Departments' ? 'Department' : o}</option>)}
              </select>

              <select
                className={`filter-pill ${locFilter !== 'All Locations' ? 'active-filter' : ''}`}
                value={locFilter}
                onChange={(e) => setLocFilter(e.target.value)}
                id="jobs-loc-filter"
              >
                {LOCATION_OPTIONS.map(o => <option key={o} value={o}>{o === 'All Locations' ? 'Location' : o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Count */}
      {!loading && (
        <div className="jobs-result-bar">
          <div className="jobs-count">
            Available jobs : <span>{filteredJobs.length}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="jobs-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="job-skeleton-card" key={i}>
              <div className="job-skeleton-content">
                <div className="job-skeleton-line" style={{ width: '70%' }} />
                <div className="job-skeleton-line" style={{ width: '50%' }} />
                <div className="job-skeleton-line" style={{ width: '40%', marginTop: 16 }} />
                <div className="job-skeleton-line" style={{ width: '35%' }} />
              </div>
              <div className="job-skeleton-icon" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="jobs-grid"
          variants={stagger}
          initial="hidden"
          animate="show"
          key={search + deptFilter + locFilter + expFilter}
        >
          <AnimatePresence>
            {filteredJobs.map((job) => (
              <motion.a
                key={job.id}
                href={job.officialWebsite || '#'}
                target="_blank"
                rel="noreferrer"
                className="job-card"
                variants={fadeIn}
                layout
              >
                <div className="job-card-content">
                  <div className="job-card-title">{job.title}</div>
                  <div className="job-card-dept">
                    {job.department}
                    {job.description ? ` - ${job.description}` : ''}
                  </div>
                  <div className="job-card-meta">
                    <span className="job-meta-item">
                      <MapPin size={14} />
                      {job.state || 'India'}
                    </span>
                    <span className="job-meta-item">
                      <Building2 size={14} />
                      {job.qualification || job.ageLimit || 'Experience N/A'}
                    </span>
                  </div>
                  <div className="job-card-deadline">
                    Last date to apply: <span>{formatDate(job.deadline)}</span>
                  </div>
                </div>
                <div className="job-card-icon">
                  <ClipboardList size={24} />
                </div>
              </motion.a>
            ))}
          </AnimatePresence>

          {filteredJobs.length === 0 && (
            <div className="jobs-empty">
              <div className="jobs-empty-icon">
                <Briefcase size={32} color="var(--text-muted)" />
              </div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters to find job openings.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
