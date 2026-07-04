import { Eye, Keyboard, Type } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
          Accessibility Statement
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
          We are committed to making our portal accessible to everyone.
        </p>
      </div>

      <div
        style={{
          background: "var(--bg-secondary)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          marginBottom: "32px",
        }}
      >
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          The Gov E-Services Portal is designed to meet Web Content
          Accessibility Guidelines (WCAG) 2.1 AA standards. We continuously work
          to improve the user experience for everyone, applying the relevant
          accessibility standards.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <Keyboard
            size={32}
            style={{ color: "#3b82f6", marginBottom: "16px" }}
          />
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            Keyboard Navigation
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            All interactive elements are fully navigable using a keyboard. Use
            Tab to move forward and Shift+Tab to move backward.
          </p>
        </div>

        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <Eye size={32} style={{ color: "#8b5cf6", marginBottom: "16px" }} />
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            Screen Readers
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Images have alternative text, and complex components include ARIA
            labels for compatibility with standard screen readers.
          </p>
        </div>

        <div
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <Type size={32} style={{ color: "#10b981", marginBottom: "16px" }} />
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            Contrast & Text
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Our color palette maintains high contrast ratios. Text can be
            resized up to 200% without loss of content or functionality.
          </p>
        </div>
      </div>

      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          Feedback
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          If you encounter any accessibility barriers on our portal, please let
          us know. You can submit a grievance or contact our support team. We
          try to respond to feedback within 2 business days.
        </p>
      </section>
    </div>
  );
}
