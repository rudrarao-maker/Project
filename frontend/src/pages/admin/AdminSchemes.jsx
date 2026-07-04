import { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "../Dashboard.css";

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    schemeCode: "",
    name: "",
    description: "",
    category: "",
    eligibility: "",
    benefits: "",
    state: "",
    department: "",
    applicationFee: "",
    officialWebsite: "",
    logoUrl: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await adminService.getSchemes({ search });
      setSchemes(res.data.data.schemes || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminService.updateScheme(editing.id, form);
        toast.success("Updated");
      } else {
        await adminService.createScheme(form);
        toast.success("Created");
      }
      setShowModal(false);
      setEditing(null);
      fetchSchemes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };
  const handleEdit = (s) => {
    setEditing(s);
    setForm({
      ...s,
      applicationFee: s.applicationFee || "",
      startDate: s.startDate?.substring(0, 10) || "",
      endDate: s.endDate?.substring(0, 10) || "",
    });
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (!confirm("Deactivate?")) return;
    try {
      await adminService.deleteScheme(id);
      toast.success("Deactivated");
      fetchSchemes();
    } catch {}
  };

  return (
    <div className="premium-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Manage Schemes</h1>
          <p className="dashboard-subtitle">
            Create and manage government schemes
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({
              schemeCode: "",
              name: "",
              description: "",
              category: "",
              eligibility: "",
              benefits: "",
              state: "",
              department: "",
              applicationFee: "",
              officialWebsite: "",
              logoUrl: "",
              startDate: "",
              endDate: "",
            });
            setShowModal(true);
          }}
          className="btn-solid-blue"
        >
          <Plus size={18} /> Add Scheme
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ position: "relative", maxWidth: "400px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchSchemes()}
            placeholder="Search schemes..."
            style={{
              width: "100%",
              padding: "10px 10px 10px 40px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
            }}
          />
        </div>
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
                  <th>Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>State</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.schemeCode}</td>
                    <td>{s.name}</td>
                    <td>{s.category || "—"}</td>
                    <td>{s.state || "—"}</td>
                    <td>₹{s.applicationFee || 0}</td>
                    <td>
                      <span
                        className={`status-badge ${s.status === "active" ? "approved" : "rejected"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(s)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#3b82f6",
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ef4444",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "var(--bg-primary)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2>{editing ? "Edit Scheme" : "New Scheme"}</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  ["schemeCode", "Scheme Code *"],
                  ["name", "Name *"],
                  ["category", "Category"],
                  ["state", "State"],
                  ["department", "Department"],
                  ["applicationFee", "Application Fee (₹)"],
                  ["officialWebsite", "Website"],
                  ["logoUrl", "Logo URL"],
                  ["startDate", "Start Date", "date"],
                  ["endDate", "End Date", "date"],
                ].map(([key, label, type]) => (
                  <div key={key}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type || "text"}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      required={key === "schemeCode" || key === "name"}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                ))}
                {[
                  ["description", "Description"],
                  ["eligibility", "Eligibility"],
                  ["benefits", "Benefits"],
                ].map(([key, label]) => (
                  <div key={key} style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "4px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {label}
                    </label>
                    <textarea
                      rows={2}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        resize: "vertical",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" className="btn-solid-blue">
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline-glow"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
