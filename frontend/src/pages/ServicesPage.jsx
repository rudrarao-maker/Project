import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Landmark,
  GraduationCap,
  HeartPulse,
  Home as HomeIcon,
  Sprout,
  Shield,
  Bus,
  Zap,
  Droplets,
  Building2,
  Briefcase,
  CreditCard,
  Wifi,
  FileText,
  Globe,
  Truck,
  IndianRupee,
  Package,
} from "lucide-react";
import { serviceService } from "../services/dataService";
import { motion, AnimatePresence } from "framer-motion";
import "./ServicesPage.css";

const CATEGORIES = [
  "All",
  "Identity Services",
  "Health",
  "Police Services",
  "Transport",
  "Education",
  "Utility & Bill Payments",
  "e-District Services",
  "Agriculture",
  "Employment",
  "Taxation",
  "Business Registration",
  "Certificates",
  "Land Records",
  "Housing",
  "Banking",
  "Digital Services",
  "Passport Services",
  "Water",
  "Electricity",
  "Women & Child Welfare",
  "Pension",
  "Public Distribution System",
];

/* ── 30 real Indian government services as fallback data ── */
const FALLBACK_SERVICES = [
  {
    id: "f1",
    name: "Aadhaar",
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
    name: "Vehicle Registration",
    category: "Transport",
    officialWebsite: "https://parivahan.gov.in",
    department: "MoRTH",
  },
  {
    id: "f7",
    name: "Ayushman Bharat Health Account (ABHA)",
    category: "Health",
    officialWebsite: "https://abha.abdm.gov.in",
    department: "NHA",
  },
  {
    id: "f8",
    name: "CoWIN Vaccination",
    category: "Health",
    officialWebsite: "https://cowin.gov.in",
    department: "MoHFW",
  },
  {
    id: "f9",
    name: "FIR Filing Online",
    category: "Police Services",
    officialWebsite: "#",
    department: "State Police",
  },
  {
    id: "f10",
    name: "Cyber Crime Reporting",
    category: "Police Services",
    officialWebsite: "https://cybercrime.gov.in",
    department: "MHA",
  },
  {
    id: "f11",
    name: "Income Tax e-Filing",
    category: "Taxation",
    officialWebsite: "https://www.incometax.gov.in",
    department: "CBDT",
  },
  {
    id: "f12",
    name: "GST Portal",
    category: "Taxation",
    officialWebsite: "https://www.gst.gov.in",
    department: "GSTN",
  },
  {
    id: "f13",
    name: "Electricity Bill Payment",
    category: "Utility & Bill Payments",
    officialWebsite: "#",
    department: "State DISCOM",
  },
  {
    id: "f14",
    name: "Water Bill Payment",
    category: "Utility & Bill Payments",
    officialWebsite: "#",
    department: "Jal Board",
  },
  {
    id: "f15",
    name: "Gas Booking (LPG)",
    category: "Utility & Bill Payments",
    officialWebsite: "#",
    department: "Oil Companies",
  },
  {
    id: "f16",
    name: "Scholarship Portal",
    category: "Education",
    officialWebsite: "https://scholarships.gov.in",
    department: "MoE",
  },
  {
    id: "f17",
    name: "Academic Bank of Credits",
    category: "Education",
    officialWebsite: "https://abc.gov.in",
    department: "UGC",
  },
  {
    id: "f18",
    name: "EPFO Services",
    category: "Employment",
    officialWebsite: "https://www.epfindia.gov.in",
    department: "MoLE",
  },
  {
    id: "f19",
    name: "ESIC Services",
    category: "Employment",
    officialWebsite: "https://www.esic.gov.in",
    department: "MoLE",
  },
  {
    id: "f20",
    name: "Kisan Suvidha",
    category: "Agriculture",
    officialWebsite: "#",
    department: "MoAFW",
  },
  {
    id: "f21",
    name: "Soil Health Card",
    category: "Agriculture",
    officialWebsite: "https://soilhealth.dac.gov.in",
    department: "MoAFW",
  },
  {
    id: "f22",
    name: "Udyam Registration",
    category: "Business Registration",
    officialWebsite: "https://udyamregistration.gov.in",
    department: "MoMSME",
  },
  {
    id: "f23",
    name: "Company Registration (MCA)",
    category: "Business Registration",
    officialWebsite: "https://www.mca.gov.in",
    department: "MCA",
  },
  {
    id: "f24",
    name: "Birth Certificate",
    category: "Certificates",
    officialWebsite: "#",
    department: "Municipal Corp.",
  },
  {
    id: "f25",
    name: "Caste Certificate",
    category: "Certificates",
    officialWebsite: "#",
    department: "Revenue Dept.",
  },
  {
    id: "f26",
    name: "Land Records (Bhulekh)",
    category: "Land Records",
    officialWebsite: "#",
    department: "Revenue Dept.",
  },
  {
    id: "f27",
    name: "PMAY Housing",
    category: "Housing",
    officialWebsite: "https://pmaymis.gov.in",
    department: "MoHUA",
  },
  {
    id: "f28",
    name: "Ration Card Services",
    category: "Public Distribution System",
    officialWebsite: "#",
    department: "Food & Civil Supplies",
  },
  {
    id: "f29",
    name: "Pension (EPFO)",
    category: "Pension",
    officialWebsite: "https://www.epfindia.gov.in",
    department: "MoLE",
  },
  {
    id: "f30",
    name: "Women Helpline 181",
    category: "Women & Child Welfare",
    officialWebsite: "#",
    department: "MoWCD",
  },
];

const CATEGORY_ICON_MAP = {
  "Identity Services": { icon: FileText, color: "#2563EB" },
  Health: { icon: HeartPulse, color: "#DC2626" },
  "Police Services": { icon: Shield, color: "#7C3AED" },
  Transport: { icon: Bus, color: "#EA580C" },
  Education: { icon: GraduationCap, color: "#059669" },
  "Utility & Bill Payments": { icon: Zap, color: "#D97706" },
  "e-District Services": { icon: Building2, color: "#0284C7" },
  Agriculture: { icon: Sprout, color: "#16A34A" },
  Employment: { icon: Briefcase, color: "#7C3AED" },
  Taxation: { icon: IndianRupee, color: "#EA580C" },
  "Business Registration": { icon: Building2, color: "#0891B2" },
  Certificates: { icon: FileText, color: "#2563EB" },
  "Land Records": { icon: Globe, color: "#059669" },
  Housing: { icon: HomeIcon, color: "#0891B2" },
  Banking: { icon: CreditCard, color: "#D97706" },
  "Digital Services": { icon: Wifi, color: "#2563EB" },
  "Passport Services": { icon: Globe, color: "#DC2626" },
  Water: { icon: Droplets, color: "#0891B2" },
  Electricity: { icon: Zap, color: "#D97706" },
  "Women & Child Welfare": { icon: HeartPulse, color: "#DB2777" },
  Pension: { icon: Landmark, color: "#7C3AED" },
  "Public Distribution System": { icon: Package, color: "#16A34A" },
};

function getBadgeClass(category) {
  const map = {
    Transport: "badge-transport",
    Health: "badge-health",
    "Police Services": "badge-police",
    Education: "badge-education",
    "Utility & Bill Payments": "badge-utility",
    "e-District Services": "badge-edistrict",
    Agriculture: "badge-agriculture",
    "Identity Services": "badge-travel",
  };
  return map[category] || "badge-default";
}

function getCategoryIcon(category) {
  const mapping = CATEGORY_ICON_MAP[category];
  if (mapping) {
    const Icon = mapping.icon;
    return <Icon size={30} color={mapping.color} />;
  }
  return <Landmark size={30} color="#475569" />;
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const pillsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    serviceService
      .getAll({
        category: activeCategory !== "All" ? activeCategory : undefined,
        search: search || undefined,
      })
      .then((r) => {
        const apiData = r.data.data.services;
        // Use API data if available, otherwise fall back to hardcoded services
        if (apiData && apiData.length > 0) {
          setServices(apiData);
        } else {
          // Apply local filtering on fallback data
          let filtered = FALLBACK_SERVICES;
          if (activeCategory !== "All") {
            filtered = filtered.filter((s) => s.category === activeCategory);
          }
          if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
              (s) =>
                s.name.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.department.toLowerCase().includes(q),
            );
          }
          setServices(filtered);
        }
      })
      .catch(() => {
        // API failed — use fallback data with local filtering
        let filtered = FALLBACK_SERVICES;
        if (activeCategory !== "All") {
          filtered = filtered.filter((s) => s.category === activeCategory);
        }
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.category.toLowerCase().includes(q) ||
              s.department.toLowerCase().includes(q),
          );
        }
        setServices(filtered);
      })
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const scrollPills = (dir) => {
    if (pillsRef.current) {
      pillsRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="min-vh-100" style={{ background: "var(--bg-secondary)" }}>
      {/* Hero Section */}
      <motion.div
        className="services-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Services on GOV E-Services</h1>
        <p className="hero-subtitle">
          Explore seamless access to many government services and schemes at one
          place, ensuring hassle-free and transparent experience for citizens.
        </p>

        {/* Search Bar */}
        <div className="services-search-bar">
          <span className="search-icon">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Department Name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            id="services-search-input"
          />
          <select className="search-dropdown" id="services-scope-dropdown">
            <option>All</option>
            <option>Central</option>
            <option>State</option>
          </select>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: "900px",
            margin: "0 auto",
            gap: "8px",
          }}
        >
          <div className="services-pill-nav">
            <button
              onClick={() => scrollPills(-1)}
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="services-category-pills" ref={pillsRef}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          <div className="services-pill-nav">
            <button
              onClick={() => scrollPills(1)}
              aria-label="Scroll categories right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Result Count */}
      {!loading && (
        <div className="services-result-bar">
          <div className="services-result-count">
            Showing <span>{services.length}</span> services
            {activeCategory !== "All" && (
              <>
                {" "}
                in <span>{activeCategory}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="services-skeleton">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-circle" />
              <div className="skeleton-line" style={{ width: "80%" }} />
              <div className="skeleton-line" style={{ width: "60%" }} />
              <div className="skeleton-badge" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        /* Empty State */
        <div className="services-empty">
          <div className="services-empty-icon">
            <Search size={32} color="var(--text-muted)" />
          </div>
          <h3>No services found</h3>
          <p>
            Try adjusting your search or category filter to find what you're
            looking for.
          </p>
        </div>
      ) : (
        /* Service Cards Grid */
        <motion.div
          className="services-grid"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          key={activeCategory + search}
        >
          <AnimatePresence>
            {services.map((svc) => (
              <motion.a
                key={svc.id}
                href={svc.officialWebsite || "#"}
                target="_blank"
                rel="noreferrer"
                className="service-card"
                variants={fadeInUp}
                layout
              >
                <div className="service-card-icon">
                  {getCategoryIcon(svc.category)}
                </div>
                <div className="service-card-name">{svc.name}</div>
                <div
                  className={`service-card-badge ${getBadgeClass(svc.category)}`}
                >
                  {svc.category || "General"}
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
