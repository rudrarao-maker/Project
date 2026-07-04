import { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import { AlertTriangle, CheckCircle2, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "../Dashboard.css";

const statusColors = {
  open: "#f59e0b",
  in_progress: "#3b82f6",
  escalated: "#ef4444",
  resolved: "#22c55e",
  closed: "#6b7280",
};

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchGrievances();
  }, [filter]);

  const fetchGrievances = async () => {
    try {
      const params = {};
      if (filter !== "all") params.status = filter;
      const res = await adminService.getGrievances(params);
      setGrievances(res.data.data.grievances || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, resolution) => {
    try {
      await adminService.updateGrievanceStatus(id, { status, resolution });
      toast.success("Updated");
      fetchGrievances();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="premium-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Grievance Management</h1>
          <p className="dashboard-subtitle">
            Review and resolve citizen grievances
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["all", "open", "in_progress", "escalated", "resolved", "closed"].map(
          (f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setLoading(true);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid var(--border-color)",
                background:
                  filter === f ? statusColors[f] || "#3b82f6" : "transparent",
                color: filter === f ? "white" : "var(--text-primary)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {f === "all" ? "All" : f.replace(/_/g, " ")}
            </button>
          ),
        )}
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: "60px" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="dashboard-panel">
          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 600 }}>{g.grievanceNumber}</td>
                    <td>{g.user?.name}</td>
                    <td>
                      {g.subject.substring(0, 40)}
                      {g.subject.length > 40 ? "..." : ""}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            g.priority === "critical"
                              ? "rgba(239,68,68,0.1)"
                              : "rgba(128,128,128,0.1)",
                          color:
                            g.priority === "critical"
                              ? "#ef4444"
                              : "var(--text-muted)",
                        }}
                      >
                        {g.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "white",
                          background: statusColors[g.status],
                        }}
                      >
                        {g.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {g.status === "open" && (
                          <button
                            onClick={() => updateStatus(g.id, "in_progress")}
                            title="Start Review"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#3b82f6",
                            }}
                          >
                            <ArrowUpCircle size={16} />
                          </button>
                        )}
                        {["open", "in_progress"].includes(g.status) && (
                          <button
                            onClick={() => {
                              const r = prompt("Enter resolution:");
                              if (r) updateStatus(g.id, "resolved", r);
                            }}
                            title="Resolve"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#22c55e",
                            }}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        {g.status !== "escalated" &&
                          g.status !== "resolved" &&
                          g.status !== "closed" && (
                            <button
                              onClick={() => updateStatus(g.id, "escalated")}
                              title="Escalate"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#ef4444",
                              }}
                            >
                              <AlertTriangle size={16} />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
