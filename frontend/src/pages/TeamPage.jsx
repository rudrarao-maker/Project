import React from "react";

const TeamPage = () => {
  return (
    <div
      className="premium-container"
      style={{ padding: "80px 24px", minHeight: "80vh" }}
    >
      <h1 className="hero-premium-title text-center mb-12">
        Our <span className="gradient-text">Team</span>
      </h1>

      <div className="glass-panel p-8 text-center mb-12">
        <p className="text-muted text-lg">
          We are a group of dedicated developers, civil servants, and
          technologists working to bridge the gap between citizens and their
          government.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Amit Kumar",
            role: "Chief Architect",
            desc: "Leading the digital infrastructure for seamless state integration.",
          },
          {
            name: "Priya Patel",
            role: "Lead UI/UX Designer",
            desc: "Focusing on accessibility and ensuring the portal is easy to use for everyone.",
          },
          {
            name: "Rajesh Singh",
            role: "Security Engineer",
            desc: "Protecting citizen data and ensuring privacy compliance across all endpoints.",
          },
        ].map((member, idx) => (
          <div key={idx} className="glass-panel p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gov-navy mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {member.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-accent text-sm font-semibold mb-4">
              {member.role}
            </p>
            <p className="text-muted text-sm">{member.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
