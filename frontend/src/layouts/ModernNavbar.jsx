import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../store/themeStore';
import { 
  Menu, X, Search, Bell, Sun, Moon, Laptop, 
  User, Settings, LogOut, ChevronDown, Globe,
  Accessibility
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';

const ModernNavbar = ({ toggleSidebar }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="umang-header-wrapper" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
      {/* Single Main Navbar (Light) */}
      <div className="umang-main-nav" style={{ backgroundColor: 'transparent', borderBottom: 'none' }}>
        <div className="umang-container nav-container" style={{ height: '70px' }}>
          
          <div className="nav-left d-flex align-items-center" style={{ flex: 1 }}>
            {isAuthenticated && (
              <button className="icon-btn sidebar-toggle mr-3 d-md-none" onClick={toggleSidebar}>
                <Menu size={20} />
              </button>
            )}
            
            <Link to="/" className="brand-logo d-flex align-items-center gap-2 text-decoration-none">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="National Emblem" 
                style={{ width: '32px', height: 'auto', filter: theme === 'dark' ? 'invert(1)' : 'none' }}
              />
              <div className="d-none d-sm-block">
                <h1 className="m-0" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gov E-Services</h1>
              </div>
            </Link>
          </div>

          <div className="umang-nav-links d-none d-lg-flex justify-content-center" style={{ flex: 2 }}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('nav.home', 'Home')}</Link>
            <Link to="/services" className={`nav-link ${location.pathname.includes('/services') ? 'active' : ''}`}>{t('nav.services', 'Services')}</Link>
            <Link to="/schemes" className={`nav-link ${location.pathname.includes('/schemes') ? 'active' : ''}`}>{t('nav.schemes', 'Schemes')}</Link>
            <Link to="/jobs" className={`nav-link ${location.pathname.includes('/jobs') ? 'active' : ''}`}>{t('nav.jobs', 'Jobs')}</Link>
            <Link to="/track" className={`nav-link ${location.pathname.includes('/track') ? 'active' : ''}`}>{t('nav.track', 'Track')}</Link>
          </div>

          <div className="nav-right d-flex align-items-center justify-content-end gap-2 gap-md-3" style={{ flex: 1 }}>
            
            <button className="icon-btn" title="Accessibility" style={{ color: 'var(--text-secondary)' }}>
              <Accessibility size={18} />
            </button>
            <button className="icon-btn" title="Toggle Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="icon-btn d-flex align-items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Globe size={18} /> <ChevronDown size={14} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown-content" sideOffset={5}>
                  <DropdownMenu.Item className="dropdown-item" onClick={() => changeLanguage('en')}>
                    English 🇬🇧
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="dropdown-item" onClick={() => changeLanguage('hi')}>
                    हिंदी (Hindi) 🇮🇳
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <button className="icon-btn search-btn m-0" onClick={() => window.toggleGlobalSearch && window.toggleGlobalSearch()} style={{ color: 'var(--text-secondary)' }} title="Search (Ctrl+K)">
              <Search size={18} />
            </button>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 gap-md-3 ml-2 border-left pl-3" style={{ borderColor: 'var(--border-color)' }}>
                <button className="icon-btn position-relative" style={{ color: 'var(--text-secondary)' }}>
                  <Bell size={18} />
                  <span className="notification-badge">3</span>
                </button>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="user-profile-btn border" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="d-none d-xl-block text-truncate" style={{ maxWidth: '100px', color: 'var(--text-primary)' }}>{user?.name}</span>
                      <ChevronDown size={14} className="d-none d-xl-block text-muted" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="dropdown-content" sideOffset={5} align="end">
                      <DropdownMenu.Label className="dropdown-label">
                        <div className="font-medium text-truncate" style={{ maxWidth: '200px' }}>{user?.name}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>{user?.email}</div>
                      </DropdownMenu.Label>
                      <DropdownMenu.Separator className="dropdown-separator" />
                      <DropdownMenu.Item className="dropdown-item" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
                        <Laptop size={16} className="mr-2" /> Dashboard
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="dropdown-item" onClick={() => navigate('/profile')}>
                        <User size={16} className="mr-2" /> {t('navbar.profile')}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="dropdown-item" onClick={() => navigate('/settings')}>
                        <Settings size={16} className="mr-2" /> {t('navbar.settings')}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="dropdown-separator" />
                      <DropdownMenu.Item className="dropdown-item text-danger" onClick={handleLogout}>
                        <LogOut size={16} className="mr-2" /> {t('navbar.logout')}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            ) : (
              <div className="ml-2 border-left pl-3 d-flex align-items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
                <Link to="/login" className="btn-umang-primary py-2 px-3">{t('auth.login', 'Login')}</Link>
                <Link to="/register" className="btn-umang-primary py-2 px-3" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>{t('auth.register', 'Register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernNavbar;
