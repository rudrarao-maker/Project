export default function CancellationPolicyPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "24px" }}>
        Cancellation & Refund Policy
      </h1>

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
          This policy outlines the conditions under which you may cancel an
          application or service request and the terms for refunds on the Gov
          E-Services Portal.
        </p>
      </div>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          1. Cancellation of Applications
        </h2>
        <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
          <li style={{ marginBottom: "8px" }}>
            Applications can only be cancelled while they are in the{" "}
            <strong>Draft</strong> or <strong>Pending</strong> state.
          </li>
          <li style={{ marginBottom: "8px" }}>
            Once an application moves to the <strong>In Progress</strong> or{" "}
            <strong>Document Verification</strong> stage, it cannot be cancelled
            by the user.
          </li>
          <li>
            To cancel a pending application, go to your Dashboard, select the
            application, and click on the "Cancel Application" button if
            available.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          2. Refund Policy
        </h2>
        <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)" }}>
          <li style={{ marginBottom: "8px" }}>
            If an application is cancelled by the user before processing begins,
            a full refund of the application fee (excluding processing charges)
            may be initiated.
          </li>
          <li style={{ marginBottom: "8px" }}>
            If an application is rejected by the concerned department due to
            invalid documents or ineligibility, fees are generally{" "}
            <strong>non-refundable</strong>.
          </li>
          <li>
            In case of double payment or payment failure where the amount was
            deducted, the refund will be automatically processed within 5-7
            working days to the original source of payment.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          3. Appointment Cancellations
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Appointments for physical document verification or office visits can
          be cancelled or rescheduled up to 24 hours before the scheduled time.
          No-shows may result in the application being put on hold.
        </p>
      </section>

      <section>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-primary)",
          }}
        >
          4. Contact Us
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          If you have any questions regarding cancellations or refunds, please
          contact the support desk or raise a grievance through the portal.
        </p>
      </section>
    </div>
  );
}
