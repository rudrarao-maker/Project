import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  ArrowRight,
  Activity,
  BookOpen,
  Briefcase,
  Landmark,
  Heart,
  Truck,
  Leaf,
  FileText,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Sparkles,
  ShieldCheck,
  Globe2,
  Users,
  BarChart3,
  Clock,
  TrendingUp,
  Building2,
  Castle,
  Map,
} from "lucide-react";
import {
  serviceService,
  schemeService,
  publicService,
} from "../services/dataService";
import { useTranslation } from "react-i18next";
import "./HomePage.css";

// Framer Motion Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const slideVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 1 } },
};

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const sliderData = [
    {
      image: "https://cdn.digitalindiacorporation.in/wp-content/uploads/2026/07/Digital-India-Web-Banner-English-1.png",
    },
    {
      image: "https://static2.india.gov.in/npiprod/uploads/large_Bharat_innovates_banner_e9734077e4.jpeg",
    },
    {
      image: "https://cdn.digitalindiacorporation.in/wp-content/uploads/2025/04/DI-Web-Banner-2-3.png",
    },
    {
      image: "https://static2.india.gov.in/npiprod/uploads/large_Bal_Vivah_Mukt_Bharat_Campaign_f9ac091f70.jpg",
    },
    {
      image: "https://cdn.digitalindiacorporation.in/wp-content/uploads/2026/02/UX4G-banner-for-events-page.png",
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderData.length]);

  /* ── Fallback data for HomePage ── */
  const FALLBACK_SERVICES = [
    {
      id: "f1",
      name: "Aadhaar Card",
      category: "Identity Services",
      officialWebsite: "https://uidai.gov.in",
      department: "UIDAI",
    },
    {
      id: "f2",
      name: "PAN Card Services",
      category: "Identity Services",
      officialWebsite: "https://www.incometax.gov.in",
      department: "Income Tax Dept.",
    },
    {
      id: "f3",
      name: "DigiLocker",
      category: "Digital Services",
      officialWebsite: "https://digilocker.gov.in",
      department: "MeitY",
    },
    {
      id: "f4",
      name: "Passport Seva",
      category: "Passport Services",
      officialWebsite: "https://passportindia.gov.in",
      department: "MEA",
    },
    {
      id: "f5",
      name: "Driving License",
      category: "Transport",
      officialWebsite: "https://parivahan.gov.in",
      department: "MoRTH",
    },
    {
      id: "f6",
      name: "CoWIN Vaccination",
      category: "Health",
      officialWebsite: "https://cowin.gov.in",
      department: "MoHFW",
    },
  ];

  const FALLBACK_SCHEMES = [
    {
      id: "s1",
      name: "PM-KISAN",
      category: "Agriculture",
      department: "Ministry of Agriculture",
      state: "Central",
      officialWebsite: "https://pmkisan.gov.in",
    },
    {
      id: "s2",
      name: "Ayushman Bharat",
      category: "Health",
      department: "Ministry of Health & Family Welfare",
      state: "Central",
      officialWebsite: "https://pmjay.gov.in",
    },
    {
      id: "s3",
      name: "MGNREGA",
      category: "Social Welfare",
      department: "Ministry of Rural Development",
      state: "Central",
      officialWebsite: "https://nrega.nic.in",
    },
    {
      id: "s4",
      name: "PM Awas Yojana",
      category: "Housing",
      department: "Ministry of Housing",
      state: "Central",
      officialWebsite: "https://pmaymis.gov.in",
    },
    {
      id: "s5",
      name: "Digital India",
      category: "Digital Services",
      department: "MeitY",
      state: "Central",
      officialWebsite: "https://digitalindia.gov.in",
    },
  ];

    const FALLBACK_NEWS = [
    {
      id: "n1",
      title: "Government Launches New Digital Portal for Farmers",
      summary: "A unified portal to help farmers access subsidies and scheme information instantly.",
      createdAt: "2026-07-01T10:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1595841697227-ea01a88b5093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "n2",
      title: "e-Shram Portal Crosses 30 Crore Registrations",
      summary: "Major milestone achieved for unorganized workers' welfare and social security.",
      createdAt: "2026-06-28T14:30:00Z",
      imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "n3",
      title: "PM-KISAN 16th Installment Released",
      summary: "Over 9 crore farmers receive financial assistance directly in their bank accounts.",
      createdAt: "2026-06-25T09:15:00Z",
      imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "n4",
      title: "New Update to DigiLocker Announced",
      summary: "Citizens can now access property documents and vehicle RC instantly.",
      createdAt: "2026-06-20T11:00:00Z",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "n5",
      title: "UMANG App Adds 50 New State Services",
      summary: "The unified mobile app for new-age governance gets a major upgrade.",
      createdAt: "2026-06-18T16:45:00Z",
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "n6",
      title: "Jan Aushadhi Kendras Expand to All Districts",
      summary: "Affordable, high-quality generic medicines now available nationwide.",
      createdAt: "2026-06-15T08:20:00Z",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, schemeRes, newsRes] = await Promise.all([
          serviceService.getAll({ limit: 6 }).catch(() => null),
          schemeService.getAll({ limit: 5 }).catch(() => null),
          publicService.getNews({ limit: 6 }).catch(() => null),
        ]);

        const sData = servRes?.data?.data?.services;
        const schData = schemeRes?.data?.data?.schemes;
        const nData = newsRes?.data?.data?.news;

        setServices(sData && sData.length > 0 ? sData : FALLBACK_SERVICES);
        setSchemes(schData && schData.length > 0 ? schData : FALLBACK_SCHEMES);
        setNews(nData && nData.length > 0 ? nData : FALLBACK_NEWS);
      } catch (err) {
        console.error(err);
        setServices(FALLBACK_SERVICES);
        setSchemes(FALLBACK_SCHEMES);
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/services?search=${search}`);
  };

  const categories = [
    {
      name: t("categories.education"),
      icon: <BookOpen size={28} />,
      color: "#3b82f6",
    },
    {
      name: t("categories.finance"),
      icon: <Landmark size={28} />,
      color: "#10b981",
    },
    {
      name: t("categories.health"),
      icon: <Heart size={28} />,
      color: "#ef4444",
    },
    {
      name: t("categories.transport"),
      icon: <Truck size={28} />,
      color: "#f59e0b",
    },
    {
      name: t("categories.agriculture"),
      icon: <Leaf size={28} />,
      color: "#84cc16",
    },
    {
      name: t("categories.employment"),
      icon: <Briefcase size={28} />,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="premium-home" ref={containerRef}>
      {/* 1. ULTRA-PREMIUM HERO SLIDER SECTION */}
      <section className="hero-premium-section">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="hero-slider-wrapper"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="hero-slide-image"
              style={{
                backgroundImage: `url(${sliderData[currentSlide].image})`,
              }}
            />
          </AnimatePresence>
          {/* Glass Overlay over Slider - removed to show banner clearly */}
          {/* <div className="hero-slider-overlay"></div> */}
        </motion.div>

        {/* Navigation Arrows */}
        <button className="slider-arrow left-arrow" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        <button className="slider-arrow right-arrow" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        <motion.div
          className="hero-premium-content !pt-0 justify-end pb-4"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          style={{ height: '100%', minHeight: '85vh', paddingBottom: '20px' }}
        >
          <motion.div variants={scaleUp} className="search-command-center w-full max-w-4xl mx-auto mt-auto transform translate-y-8">
            <form onSubmit={handleSearch} className="premium-search-form shadow-2xl bg-white/95 backdrop-blur-md">
              <Search className="premium-search-icon" size={24} />
              <input
                type="text"
                placeholder={
                  t("home.searchPlaceholder") ||
                  "Search for services, schemes, or jobs..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-divider"></div>
              <button type="submit" className="btn-glow">
                {t("home.searchBtn") || "Search"} <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>

          {/* Slider Indicators */}
          <motion.div variants={fadeInUp} className="premium-slider-indicators">
            {sliderData.map((_, idx) => (
              <button
                key={idx}
                className={`premium-indicator-dot ${currentSlide === idx ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 1.5 ANIMATED STATISTICS */}
      <section
        className="premium-section stats-banner bg-white"
        style={{
          borderBottom: "1px solid var(--border-color)",
          padding: "40px 0",
        }}
      >
        <div className="premium-container">
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <motion.div variants={scaleUp} className="stat-card">
              <div className="text-4xl font-bold text-gov-navy mb-2">500+</div>
              <div className="text-sm font-medium text-muted uppercase">
                Total Services
              </div>
            </motion.div>
            <motion.div variants={scaleUp} className="stat-card">
              <div className="text-4xl font-bold text-gov-navy mb-2">
                1,200+
              </div>
              <div className="text-sm font-medium text-muted uppercase">
                Total Schemes
              </div>
            </motion.div>
            <motion.div variants={scaleUp} className="stat-card">
              <div className="text-4xl font-bold text-gov-navy mb-2">2M+</div>
              <div className="text-sm font-medium text-muted uppercase">
                Registered Users
              </div>
            </motion.div>
            <motion.div variants={scaleUp} className="stat-card">
              <div className="text-4xl font-bold text-gov-navy mb-2">15M+</div>
              <div className="text-sm font-medium text-muted uppercase">
                Applications Submitted
              </div>
            </motion.div>
            <motion.div variants={scaleUp} className="stat-card">
              <div className="text-4xl font-bold text-gov-navy mb-2">40M+</div>
              <div className="text-sm font-medium text-muted uppercase">
                Documents Processed
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. BENTO BOX SERVICES & CATEGORIES */}
      <section className="premium-section mt-negative">
        <div className="premium-container">
          <motion.div
            className="bento-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Main Stats / Trust Card (Spans 2 columns) */}
            <motion.div
              variants={scaleUp}
              className="bento-card col-span-2 glass-panel feature-card pattern-bg"
            >
              <div className="bento-content">
                <ShieldCheck size={32} className="text-accent mb-4" />
                <h3>Secure & Verified</h3>
                <p>
                  Over 10 Million+ citizens trust our unified platform for daily
                  government interactions and document retrieval.
                </p>
                <div className="stats-row mt-6">
                  <div className="stat-item">
                    <span className="stat-num">500+</span>
                    <span className="stat-label">Services</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">99.9%</span>
                    <span className="stat-label">Uptime</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Categories Mini-Grid */}
            <motion.div
              variants={scaleUp}
              className="bento-card glass-panel no-padding"
            >
              <div className="bento-header p-6 pb-2">
                <h3>{t("home.categories")}</h3>
              </div>
              <div className="micro-category-grid p-6 pt-2">
                {categories.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="micro-cat-item group">
                    <div
                      className="micro-icon"
                      style={{
                        color: cat.color,
                        backgroundColor: `${cat.color}15`,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <span className="micro-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Helpdesk Card (Replacing Popular Services in Grid) */}
            <motion.div
              variants={scaleUp}
              className="bento-card glass-panel flex-center text-center"
            >
              <div
                className="mb-4 relative mx-auto flex-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.1)",
                }}
              >
                <Users size={32} className="text-gov-blue" />
              </div>
              <h3>Citizen Helpdesk</h3>
              <p className="text-muted text-sm mt-2">
                24/7 Support for your queries.
              </p>
              <Link
                to="/support"
                className="btn-solid-blue mt-4"
                style={{ padding: "8px 24px", fontSize: "14px" }}
              >
                Get Help
              </Link>
            </motion.div>

            {/* Global Reach Card (Spans 2 columns now) */}
            <motion.div
              variants={scaleUp}
              className="bento-card col-span-2 glass-panel flex-center text-center overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-radial opacity-20"></div>
              <Globe2 size={48} className="text-accent mb-4 float-anim" />
              <h3 className="relative z-10">All India Coverage</h3>
              <p className="text-muted relative z-10 text-sm mt-2">
                Connecting every state and union territory through a single,
                unified digital platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PREMIUM SERVICES LIST */}
      <section className="premium-section">
        <div className="premium-container">
          <div className="section-header-modern">
            <div className="header-content">
              <h2 className="gradient-text">Government Services</h2>
              <p>Most frequently accessed citizen services</p>
            </div>
            <Link to="/services" className="btn-outline-glow">
              {t("home.viewAll")}
            </Link>
          </div>

          <motion.div
            className="premium-list"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {!loading &&
              services.length > 0 &&
              services.slice(0, 6).map((svc) => (
                <motion.div variants={fadeInUp} key={svc.id}>
                  <Link to="/services" className="premium-list-item group">
                    <div className="item-meta">
                      <h4>{svc.name}</h4>
                      <p>{svc.department}</p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="arrow-icon group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* 4. ELEGANT SCHEMES CAROUSEL */}
      <section className="premium-section border-t-glow">
        <div className="premium-container">
          <div className="section-header-modern">
            <div className="header-content">
              <h2 className="gradient-text">{t("home.schemes")}</h2>
              <p>{t("home.schemesSub")}</p>
            </div>
            <Link to="/schemes" className="btn-outline-glow">
              {t("home.viewAll")}
            </Link>
          </div>

          <div className="horizontal-scroll-container hide-scrollbar">
            <div className="schemes-modern-grid">
              {!loading &&
                schemes.map((scheme, idx) => (
                  <motion.div
                    key={scheme.id}
                    className="scheme-modern-card glass-panel group"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="card-glow-effect"></div>
                    <div className="scheme-badges">
                      <span className="badge-glass">{scheme.category}</span>
                      <span className="text-xs text-muted">{scheme.state}</span>
                    </div>
                    <h3>{scheme.name}</h3>
                    <p className="line-clamp-3">{scheme.description}</p>
                    <div className="scheme-footer-modern">
                      <div className="benefit-pill">
                        <Activity size={14} />{" "}
                        {scheme.benefits?.substring(0, 25)}...
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. UMANG-STYLE STAGGERED STATES SECTION */}
      <section className="premium-section">
        <div className="premium-container umang-states-container">
          {/* Left Side: Staggered Cards Grid */}
          <div className="states-staggered-wrapper">
            <div className="states-bg-shape"></div>
            <div className="states-staggered-grid">
              {/* Column 1 */}
              <div className="stagger-col col-even">
                <Link
                  to="/services?state=Delhi"
                  className="umang-state-card glass-panel group"
                >
                  <div className="umang-state-icon-wrapper">
                    <div className="icon-circle"></div>
                    <Landmark
                      size={48}
                      strokeWidth={1}
                      className="state-line-icon"
                    />
                  </div>
                  <h4>Delhi</h4>
                </Link>

                <Link
                  to="/services?state=Haryana"
                  className="umang-state-card glass-panel group"
                >
                  <div className="umang-state-icon-wrapper">
                    <div className="icon-circle"></div>
                    <Building2
                      size={48}
                      strokeWidth={1}
                      className="state-line-icon"
                    />
                  </div>
                  <h4>Haryana</h4>
                </Link>
              </div>

              {/* Column 2 (Offset) */}
              <div className="stagger-col col-odd">
                <Link
                  to="/services?state=Gujarat"
                  className="umang-state-card glass-panel group"
                >
                  <div className="umang-state-icon-wrapper">
                    <div className="icon-circle"></div>
                    <Castle
                      size={48}
                      strokeWidth={1}
                      className="state-line-icon"
                    />
                  </div>
                  <h4>Gujarat</h4>
                </Link>

                <Link
                  to="/services?state=Maharashtra"
                  className="umang-state-card glass-panel group"
                >
                  <div className="umang-state-icon-wrapper">
                    <div className="icon-circle"></div>
                    <Map
                      size={48}
                      strokeWidth={1}
                      className="state-line-icon"
                    />
                  </div>
                  <h4>Maharashtra</h4>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Info & Button */}
          <div className="states-info-content">
            <h2>Services by States</h2>
            <p>
              Explore services offered by different States and Union Territories
              of India!
            </p>
            <Link to="/services?state=all" className="btn-solid-blue">
              Explore 30+ States
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS OF PORTAL SECTION (As requested from screenshot) */}
      <section className="benefits-section">
        <div className="premium-container benefits-container">
          <div className="benefits-content">
            <h2 className="benefits-title">Benefits of Gov E-Services</h2>
            <p className="benefits-desc">
              An initiative by National e-Governance Division (NeGD), Ministry
              of Electronics and Information Technology (MeitY). Our portal
              strives to be the one-stop gateway to all government schemes and
              services through different channels.
            </p>

            <div className="benefits-grid">
              {/* Card 1 */}
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Activity size={24} className="text-gov-blue" />
                </div>
                <h3 className="benefit-card-title">
                  All Services and Schemes at one place
                </h3>
                <div className="benefit-pills">
                  <span className="pill">Central Government</span>
                  <span className="pill">Utility Bills</span>
                  <span className="pill">State Government</span>
                  <span className="pill">Schemes</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="benefit-card">
                <div className="benefit-icon">
                  <FileText size={24} className="text-gov-blue" />
                </div>
                <h3 className="benefit-card-title">
                  All Documents at one place
                </h3>
                <div className="benefit-pills">
                  <span className="pill">Aadhaar</span>
                  <span className="pill">Driving License</span>
                  <span className="pill">PAN</span>
                  <span className="pill">Vehicle RC</span>
                  <span className="pill">DigiLocker</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Globe2 size={24} className="text-gov-blue" />
                </div>
                <h3 className="benefit-card-title">
                  All Engagements at one place
                </h3>
                <div className="benefit-pills">
                  <span className="pill">Feedback & Rating</span>
                  <span className="pill">Notifications</span>
                  <span className="pill">Customer Support</span>
                  <span className="pill">Live Chat</span>
                  <span className="pill">AI Bot</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Landmark size={24} className="text-gov-blue" />
                </div>
                <h3 className="benefit-card-title">
                  All Transactions at one place
                </h3>
                <div className="benefit-pills">
                  <span className="pill">Status</span>
                  <span className="pill">Bills</span>
                  <span className="pill">Applications</span>
                  <span className="pill">and many more</span>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-image-container">
            {/* Using a high-quality relevant image of a person with a phone */}
            <img
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Person using mobile app"
              className="benefits-promo-image"
            />
          </div>
        </div>
      </section>

      {/* 5.5 VIDEO GUIDES & TUTORIALS */}
      <section className="premium-section bg-gray-50/50">
        <div className="premium-container">
          <div className="section-header-modern text-center flex-col justify-center mb-12">
            <h2>Video Guides & Tutorials</h2>
            <p>Learn how to use various government services with our step-by-step guides.</p>
          </div>

          <div className="video-grid">
            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/M7lc1UVf-VE" 
                title="How to register for Digital India Services" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">How to use Digital India Portal</h3>
                <p className="text-sm text-gray-600 mt-2">A complete step-by-step registration guide.</p>
              </div>
            </div>

            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/jNQXAC9IVRw" 
                title="Umang App Tutorial" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">UMANG App Registration</h3>
                <p className="text-sm text-gray-600 mt-2">Access hundreds of services on your mobile.</p>
              </div>
            </div>

            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/tgbNymZ7vqY" 
                title="DigiLocker Setup" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">Setup your DigiLocker</h3>
                <p className="text-sm text-gray-600 mt-2">Securely store your documents in the cloud.</p>
              </div>
            </div>

            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/K4TOrB7at0Y" 
                title="Apply for PAN Card" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">Apply for Services Online</h3>
                <p className="text-sm text-gray-600 mt-2">Learn how to fill and submit application forms.</p>
              </div>
            </div>

            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/5aC4jHhJ6-o" 
                title="Aadhaar Card Update Tutorial" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">Update Aadhaar Details</h3>
                <p className="text-sm text-gray-600 mt-2">How to update address and mobile number online.</p>
              </div>
            </div>

            <div className="video-card glass-panel">
              <iframe 
                width="100%" 
                height="215" 
                src="https://www.youtube.com/embed/rV3j7b6FvI4" 
                title="Ayushman Bharat Guide" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-t-xl"
              ></iframe>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--gov-navy)]">Ayushman Bharat Guide</h3>
                <p className="text-sm text-gray-600 mt-2">Step-by-step process for health card benefits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PREMIUM LIVE NEWS SECTION */}
      <section className="premium-section border-t-glow">
        <div className="premium-container">
          <div className="section-header-modern text-center flex-col justify-center mb-12">
            <h2>{t("home.news")}</h2>
            <p>{t("home.newsSub")}</p>
          </div>

          <motion.div
            className="premium-news-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {!loading &&
              news.map((item, idx) => (
                <motion.div
                  variants={fadeInUp}
                  key={item.id}
                  className="news-premium-card glass-panel group"
                >
                  <div className="news-image-wrapper">
                    <div
                      className="news-img"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + idx}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)`,
                      }}
                    />
                    <div className="news-date-badge">
                      {new Date(item.publishedAt).toLocaleDateString(
                        undefined,
                        { day: "numeric", month: "short" },
                      )}
                    </div>
                  </div>
                  <div className="news-content p-6">
                    <span className="news-category-pill">
                      {item.category || "Announcement"}
                    </span>
                    <h3 className="mt-4 mb-2 text-lg font-bold group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted text-sm line-clamp-3">
                      {item.content}
                    </p>
                    <Link
                      to="#"
                      className="news-read-more mt-4 inline-flex items-center text-sm font-semibold text-accent"
                    >
                      Read Full Story{" "}
                      <ArrowRight
                        size={14}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
