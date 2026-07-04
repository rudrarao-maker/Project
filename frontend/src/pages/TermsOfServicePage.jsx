import React from "react";

const TermsOfServicePage = () => {
  return (
    <div
      className="premium-container"
      style={{ padding: "80px 24px", minHeight: "80vh" }}
    >
      <h1 className="hero-premium-title text-center mb-12">
        Terms & <span className="gradient-text">Conditions</span>
      </h1>

      <div className="glass-panel p-8">
        <div className="space-y-6 text-muted" style={{ lineHeight: "1.8" }}>
          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the Gov E-Services Portal, you accept and
              agree to be bound by the terms and provisions of this agreement.
              These terms apply to all visitors, users, and others who access or
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">
              2. User Accounts
            </h2>
            <p>
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. Failure to
              do so constitutes a breach of the Terms, which may result in
              immediate termination of your account on our Service. You are
              responsible for safeguarding the password that you use to access
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">
              3. Service Availability
            </h2>
            <p>
              While we strive to ensure that the Gov E-Services Portal is
              available 24/7, we shall not be liable if for any reason the
              portal is unavailable at any time or for any period. Access to the
              portal may be suspended temporarily and without notice in the case
              of system failure, maintenance, or repair.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gov-navy mb-3">
              4. Fraudulent Use
            </h2>
            <p>
              Any fraudulent use of this platform, including providing false
              documentation, misrepresentation of identity, or attempting to
              bypass security measures, is strictly prohibited and is punishable
              under the IT Act, 2000 and other relevant Indian laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
