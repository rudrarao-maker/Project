import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const ModernFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="umang-footer">
      <div className="umang-footer-container">
        <div className="footer-columns">
          
          {/* Column 1 */}
          <div className="footer-col">
            <h4 className="footer-heading">Gov E-Services</h4>
            <div className="footer-contact">
              <p>Digital platform for citizen services in India.</p>
              <p>Powered by Digital India Initiative.</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/team">Our Team</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <p>Mahesana, Gujarat</p>
              <p>+91 88493 97045</p>
              <Link to="/contact" className="btn-contact-outline">Contact Us</Link>
            </div>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4 className="footer-heading">Subscribe</h4>
            <div className="footer-contact">
              <p>Get updates on new services and schemes</p>
            </div>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" required />
              <button type="submit">Send</button>
            </form>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            &copy; 2026 Gov E-Services Portal | All Rights Reserved
          </div>
          <div className="footer-bottom-links d-flex align-items-center">
            <Link to="/developers">Meet Our Developers</Link>
            <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top" style={{ position: 'relative', marginLeft: '24px' }}>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
