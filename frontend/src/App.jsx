import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useTheme, applyTheme } from "./store/themeStore";

// Layouts & Global Components
import MainLayout from "./layouts/MainLayout";
import TopProgressBar from "./components/common/TopProgressBar";
import HelpdeskWidget from "./components/HelpdeskWidget";
import GlobalSearchModal from "./components/common/GlobalSearchModal";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import ServicesPage from "./pages/ServicesPage";
import SchemesPage from "./pages/SchemesPage";
import JobsPage from "./pages/JobsPage";
import ContactPage from "./pages/ContactPage";
import TrackApplicationPage from "./pages/TrackApplicationPage";

// User Protected Pages
import UserDashboard from "./pages/UserDashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import PaymentGateway from "./pages/PaymentGateway";
import GrievancePage from "./pages/GrievancePage";
import AppointmentPage from "./pages/AppointmentPage";
import UserActivityPage from "./pages/UserActivityPage";
import NotificationsPage from "./pages/NotificationsPage";
import WalletPage from "./pages/WalletPage";
import DigitalLockerPage from "./pages/DigitalLockerPage";
import UserTasks from "./pages/UserTasks";

// Admin Protected Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminServices from "./pages/admin/AdminServices";
import AdminSchemes from "./pages/admin/AdminSchemes";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminGrievances from "./pages/admin/AdminGrievances";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminLiveChat from "./pages/admin/AdminLiveChat";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminFileManager from "./pages/admin/AdminFileManager";

// Information & Policy Pages
import AboutPage from "./pages/AboutPage";
import TeamPage from "./pages/TeamPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import CancellationPolicyPage from "./pages/CancellationPolicyPage";
import FAQPage from "./pages/FAQPage";
import VideoGuidePage from "./pages/VideoGuidePage";
import UserManualPage from "./pages/UserManualPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import PlaceholderPage from "./pages/PlaceholderPage";

// Modal Controller component
function GlobalModals() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Expose toggle globally for Navbar
  window.toggleGlobalSearch = () => setSearchOpen(true);

  return (
    <GlobalSearchModal
      isOpen={searchOpen}
      onClose={() => setSearchOpen(false)}
    />
  );
}

function App() {
  const { theme, accentColor } = useTheme();

  useEffect(() => {
    applyTheme(theme);
    document.documentElement.setAttribute("data-accent", accentColor);
  }, [theme, accentColor]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <TopProgressBar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "8px", fontSize: "14px" },
          }}
        />
        <GlobalModals />
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <UserTasks />
                </ProtectedRoute>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />

            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/track" element={<TrackApplicationPage />} />

            {/* Information */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route
              path="/cancellation-policy"
              element={<CancellationPolicyPage />}
            />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/video-guide" element={<VideoGuidePage />} />
            <Route path="/user-manual" element={<UserManualPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            {/* Placeholders for minor pages */}
            <Route path="/case-study" element={<PlaceholderPage />} />
            <Route path="/partners" element={<PlaceholderPage />} />
            <Route path="/ebook" element={<PlaceholderPage />} />

            {/* Protected User */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/service/:id"
              element={
                <ProtectedRoute>
                  <ApplicationFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/scheme/:id"
              element={
                <ProtectedRoute>
                  <ApplicationFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <PaymentGateway />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grievances"
              element={
                <ProtectedRoute>
                  <GrievancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <UserActivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/locker"
              element={
                <ProtectedRoute>
                  <DigitalLockerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminRoute>
                  <AdminApplications />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <AdminRoute>
                  <AdminTasks />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/files"
              element={
                <AdminRoute>
                  <AdminFileManager />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schemes"
              element={
                <AdminRoute>
                  <AdminSchemes />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminRoute>
                  <AdminJobs />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/grievances"
              element={
                <AdminRoute>
                  <AdminGrievances />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <AdminRoute>
                  <AdminRoles />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/chat"
              element={
                <AdminRoute>
                  <AdminLiveChat />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
        <HelpdeskWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
