import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  FileText,
  Briefcase,
  Settings,
  Users,
  BarChart2,
  File,
  Calendar,
  CheckSquare,
  X,
  Activity,
  AlertTriangle,
  List,
  Shield,
  Wallet,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";

const ProfessionalSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    {
      name: "My Applications",
      path: "/applications",
      icon: <FileText size={20} />,
    },
    { name: "Digital Locker", path: "/locker", icon: <Shield size={20} /> },
    {
      name: "Grievances",
      path: "/grievances",
      icon: <AlertTriangle size={20} />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <Calendar size={20} />,
    },
    { name: "Activity", path: "/activity", icon: <Activity size={20} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={20} /> },
  ];

  const adminLinks = [
    { name: "Overview", path: "/admin", icon: <BarChart2 size={20} /> },
    {
      name: "Applications",
      path: "/admin/applications",
      icon: <FileText size={20} />,
    },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Services",
      path: "/admin/services",
      icon: <Briefcase size={20} />,
    },
    { name: "Schemes", path: "/admin/schemes", icon: <List size={20} /> },
    { name: "Jobs", path: "/admin/jobs", icon: <Briefcase size={20} /> },
    {
      name: "Grievances",
      path: "/admin/grievances",
      icon: <AlertTriangle size={20} />,
    },
    { name: "Roles", path: "/admin/roles", icon: <Shield size={20} /> },
    {
      name: "Live Chat",
      path: "/admin/chat",
      icon: <MessageSquare size={20} />,
    },
    { name: "Tasks", path: "/admin/tasks", icon: <CheckSquare size={20} /> },
    { name: "File Manager", path: "/admin/files", icon: <FileText size={20} /> },
  ];

  const appLinks = [
    { name: "My Wallet", path: "/wallet", icon: <Wallet size={20} /> },
    { name: "File Manager", path: "/locker", icon: <FileText size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const SidebarContent = () => (
    <div className="sidebar-content">
      {isMobile && (
        <div className="sidebar-header d-md-none">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={toggleSidebar} className="icon-btn">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="sidebar-section">
        <span className="sidebar-label">Main Menu</span>
        <nav className="sidebar-nav">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={clsx("sidebar-link", active && "active")}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-text">{link.name}</span>
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="active-indicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">Apps</span>
        <nav className="sidebar-nav">
          {appLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                "sidebar-link",
                location.pathname === link.path && "active",
              )}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-text">{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Link to="/settings" className="sidebar-link">
          <span className="sidebar-icon">
            <Settings size={20} />
          </span>
          <span className="sidebar-text">Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={clsx(
          "professional-sidebar d-none d-md-flex",
          !isOpen && "collapsed",
        )}
        initial={false}
        animate={{ width: isOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            <motion.div
              className="sidebar-overlay d-md-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            <motion.aside
              className="professional-sidebar mobile d-md-none"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfessionalSidebar;
