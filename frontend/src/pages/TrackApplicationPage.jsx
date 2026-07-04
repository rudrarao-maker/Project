import { useState } from "react";
import { trackService } from "../services/dataService";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const statusColors = {
  pending: "#f59e0b",
  document_verification: "#8b5cf6",
  in_progress: "#3b82f6",
  payment_pending: "#f97316",
  payment_completed: "#06b6d4",
  approved: "#22c55e",
  rejected: "#ef4444",
  completed: "#10b981",
  on_hold: "#6b7280",
  correction_required: "#dc2626",
  draft: "#9ca3af",
};

export default function TrackApplicationPage() {
  const [appNumber, setAppNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await trackService.trackApplication(appNumber.trim());
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Application not found");
      toast.error("Application not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}
          >
            Track Your Application
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Enter your application number to check the current status
          </p>
        </div>

        <form
          onSubmit={handleTrack}
          style={{ display: "flex", gap: "12px", marginBottom: "40px" }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              placeholder="Enter Application Number (e.g., APP2026123456)"
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                borderRadius: "12px",
                border: "2px solid var(--border-color)",
                background: "var(--bg-secondary)",
                fontSize: "16px",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-solid-blue"
            style={{
              padding: "16px 32px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? (
              "Tracking..."
            ) : (
              <>
                Track <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "24px",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              textAlign: "center",
              color: "#ef4444",
            }}
          >
            <XCircle size={32} style={{ marginBottom: "8px" }} />
            <p style={{ fontWeight: 600 }}>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Status Card */}
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "4px",
                    }}
                  >
                    Application Number
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 700 }}>
                    {result.applicationNumber}
                  </div>
                </div>
                <span
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "white",
                    background: statusColors[result.status] || "#6b7280",
                  }}
                >
                  {result.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    Service
                  </span>
                  <div style={{ fontWeight: 600 }}>{result.serviceName}</div>
                </div>
                {result.department && (
                  <div>
                    <span
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      Department
                    </span>
                    <div style={{ fontWeight: 600 }}>{result.department}</div>
                  </div>
                )}
                <div>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    Submitted
                  </span>
                  <div style={{ fontWeight: 600 }}>
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    Last Updated
                  </span>
                  <div style={{ fontWeight: 600 }}>
                    {new Date(result.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {result.remarks && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "rgba(59,130,246,0.1)",
                    fontSize: "14px",
                  }}
                >
                  <strong>Remarks:</strong> {result.remarks}
                </div>
              )}
            </div>

            {/* Timeline */}
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              Application Timeline
            </h2>
            <div style={{ position: "relative", paddingLeft: "40px" }}>
              {result.timeline.map((stage, i) => (
                <div
                  key={stage.key}
                  style={{
                    position: "relative",
                    paddingBottom:
                      i === result.timeline.length - 1 ? "0" : "32px",
                  }}
                >
                  {i < result.timeline.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "-28px",
                        top: "32px",
                        width: "2px",
                        height: "calc(100% - 16px)",
                        background: stage.completed
                          ? "#22c55e"
                          : "var(--border-color)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      left: "-36px",
                      top: "4px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: stage.completed
                        ? "#22c55e"
                        : stage.current
                          ? "#3b82f6"
                          : "var(--bg-tertiary)",
                      border: `2px solid ${stage.completed ? "#22c55e" : stage.current ? "#3b82f6" : "var(--border-color)"}`,
                    }}
                  >
                    {stage.completed && (
                      <CheckCircle2 size={12} color="white" />
                    )}
                    {stage.current && !stage.completed && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ padding: "4px 0" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "15px",
                        color: stage.current
                          ? "#3b82f6"
                          : stage.completed
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      {stage.label}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {stage.description}
                    </div>
                    {stage.timestamp && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginTop: "4px",
                        }}
                      >
                        {new Date(stage.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
