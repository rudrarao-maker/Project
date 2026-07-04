import React from "react";

const AboutPage = () => {
  return (
    <div
      className="premium-container"
      style={{ padding: "80px 24px", minHeight: "80vh" }}
    >
      <h1 className="hero-premium-title text-center mb-12">
        About <span className="gradient-text">Gov E-Services</span>
      </h1>

      <div className="glass-panel p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted mb-4" style={{ lineHeight: "1.8" }}>
          Gov E-Services is a pioneering digital platform dedicated to
          transforming how citizens interact with government services across
          India. Powered by the Digital India Initiative, our mission is to
          provide a single, unified gateway for accessing hundreds of essential
          government services, welfare schemes, and employment opportunities
          seamlessly and securely.
        </p>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          By eliminating bureaucratic silos and bridging the gap between state
          and central departments, we aim to foster transparency, efficiency,
          and accessibility for all citizens, regardless of their location or
          digital literacy level.
        </p>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
        <p className="text-muted" style={{ lineHeight: "1.8" }}>
          We envision a digitally empowered society where every Indian citizen
          has seamless access to their rights, entitlements, and government
          benefits through a user-centric, inclusive, and highly secure digital
          infrastructure. Through continuous innovation and integration, Gov
          E-Services will continue to evolve into a comprehensive ecosystem that
          simplifies governance for all.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
