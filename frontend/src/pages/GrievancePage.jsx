import { useState, useEffect } from "react";
import { grievanceService, applicationService } from "../services/dataService";
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  ArrowRight,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const statusColors = {
  open: "#f59e0b",
  in_progress: "#3b82f6",
  escalated: "#ef4444",
  resolved: "#22c55e",
  closed: "#6b7280",
};

export default function GrievancePage() {
  const [grievances, setGrievances] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    description: "",
    category: "",
    applicationId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, aRes] = await Promise.all([
        grievanceService.getAll(),
        applicationService.getAll(),
      ]);
      setGrievances(gRes.data.data.grievances || []);
      setApplications(aRes.data.data.applications || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await grievanceService.submit(form);
      toast.success("Grievance submitted successfully!");
      setShowForm(false);
      setForm({
        subject: "",
        description: "",
        category: "",
        applicationId: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="premium-dashboard flex-center">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700 }}>Grievances</h1>
          <p style={{ color: "var(--text-muted)" }}>
            File and track your complaints
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-solid-blue"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> File Grievance
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "24px",
            borderRadius: "16px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>New Grievance</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Brief description of your complaint"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="delay">Processing Delay</option>
                  <option value="rejection">Unfair Rejection</option>
                  <option value="service">Poor Service</option>
                  <option value="technical">Technical Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Related Application (Optional)
                </label>
                <select
                  value={form.applicationId}
                  onChange={(e) =>
                    setForm({ ...form, applicationId: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">None</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.applicationNumber} — {app.service?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Provide detailed description of your grievance..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-solid-blue"
              >
                {submitting ? "Submitting..." : "Submit Grievance"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline-glow"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {grievances.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-muted)",
          }}
        >
          <AlertTriangle
            size={48}
            style={{ marginBottom: "16px", opacity: 0.5 }}
          />
          <h3>No grievances filed</h3>
          <p>Click "File Grievance" to submit a complaint</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {grievances.map((g) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "16px" }}>
                    {g.subject}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {g.grievanceNumber} •{" "}
                    {new Date(g.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "white",
                    background: statusColors[g.status] || "#6b7280",
                  }}
                >
                  {g.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginTop: "8px",
                }}
              >
                {g.description.substring(0, 150)}...
              </p>
              {g.application && (
                <div style={{ fontSize: "13px", marginTop: "8px" }}>
                  <FileText
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />{" "}
                  Related: {g.application.applicationNumber}
                </div>
              )}
              {g.resolution && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "rgba(34,197,94,0.1)",
                    fontSize: "13px",
                  }}
                >
                  <strong>Resolution:</strong> {g.resolution}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
