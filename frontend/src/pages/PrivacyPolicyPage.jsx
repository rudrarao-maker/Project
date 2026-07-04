import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="premium-container" style={{ padding: '80px 24px', minHeight: '80vh' }}>
      <h1 className="hero-premium-title text-center mb-12">Privacy <span className="gradient-text">Policy</span></h1>
      
      <div className="glass-panel p-8">
        <div className="space-y-6 text-muted" style={{ lineHeight: '1.8' }}>
          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">1. Information Collection</h2>
            <p>
              Gov E-Services collects information to provide better services to all our users. This includes basic information such as your name, 
              Aadhaar details (when explicitly required for a service), email address, and demographic information necessary for delivering targeted 
              government schemes and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">2. How We Use Information</h2>
            <p>
              The information collected is strictly used for the processing of your applications, identity verification, and delivery of 
              e-governance services. We do not sell, rent, or share your personal data with third-party commercial entities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">3. Data Security</h2>
            <p>
              We implement state-of-the-art security measures including end-to-end encryption, regular security audits, and strict access controls 
              to ensure your data is protected against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">4. User Rights</h2>
            <p>
              As a citizen, you have the right to access, correct, and request deletion of your personal data stored on this portal, subject to 
              legal and administrative requirements of the Government of India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
