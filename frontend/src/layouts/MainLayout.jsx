import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModernNavbar from "./ModernNavbar";
import ProfessionalSidebar from "./ProfessionalSidebar";
import ModernFooter from "./ModernFooter";
import CommandPalette from "../components/common/CommandPalette";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-wrapper">
      <ModernNavbar toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        {isAuthenticated && (
          <ProfessionalSidebar
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        )}

        <main
          className={`main-content ${isAuthenticated ? "with-sidebar" : "public"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`page-container ${location.pathname === "/" ? "full-width-page" : ""}`}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ModernFooter />
      <CommandPalette />
    </div>
  );
};

export default MainLayout;
