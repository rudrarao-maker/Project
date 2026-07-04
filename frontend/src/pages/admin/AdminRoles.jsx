import { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "../Dashboard.css";

const MODULES = [
  "dashboard",
  "users",
  "applications",
  "services",
  "schemes",
  "jobs",
  "documents",
  "grievances",
  "news",
  "audit",
];

export default function AdminRoles() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await adminService.getAdminRoles();
      setAdmins(res.data.data.admins || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const updatePermissions = async (id, permissions, role) => {
    try {
      await adminService.updateAdminPermissions(id, { permissions, role });
      toast.success("Permissions updated");
      fetchRoles();
    } catch {
      toast.error("Failed to update");
    }
  };

  const togglePermission = (admin, module) => {
    const perms = admin.permissions || {};
    perms[module] = !perms[module];
    updatePermissions(admin.id, perms, admin.role);
  };

  if (user?.role !== "super_admin") {
    return (
      <div className="premium-dashboard">
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "var(--text-muted)",
          }}
        >
          <Shield size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
          <h2>Access Denied</h2>
          <p>Only Super Admins can manage roles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Roles & Permissions</h1>
          <p className="dashboard-subtitle">Manage admin access control</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: "60px" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="dashboard-panel">
          <div className="premium-table-wrapper" style={{ overflowX: "auto" }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Role</th>
                  <th>Department</th>
                  {MODULES.map((m) => (
                    <th
                      key={m}
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        textTransform: "capitalize",
                      }}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div
                        style={{ fontSize: "12px", color: "var(--text-muted)" }}
                      >
                        {a.email}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            a.role === "super_admin"
                              ? "rgba(139,92,246,0.1)"
                              : "rgba(59,130,246,0.1)",
                          color:
                            a.role === "super_admin" ? "#8b5cf6" : "#3b82f6",
                        }}
                      >
                        {a.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>{a.department || "—"}</td>
                    {MODULES.map((m) => (
                      <td key={m} style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={
                            a.role === "super_admin" ||
                            !!(a.permissions && a.permissions[m])
                          }
                          disabled={a.role === "super_admin"}
                          onChange={() => togglePermission(a, m)}
                          style={{
                            cursor:
                              a.role === "super_admin"
                                ? "not-allowed"
                                : "pointer",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </td>
                    ))}
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
