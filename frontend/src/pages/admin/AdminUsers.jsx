import React, { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import toast from "react-hot-toast";
import {
  Search,
  UserCheck,
  UserX,
  Clock,
  MoreVertical,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import "../Dashboard.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filterStatus, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus,
        search: searchTerm,
      };
      const res = await adminService.getUsers(params);
      setUsers(res.data.data.users);
      setPagination(res.data.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.toggleUserStatus(id, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="premium-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="dashboard-title">User Management</h1>
          <p className="dashboard-subtitle">
            View, search, and manage registered citizens
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show">
        <motion.div variants={fadeInUp} className="dashboard-panel mb-6 p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="text"
                className="premium-input w-full pl-12"
                placeholder="Search by name, email, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="premium-input w-48"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending</option>
            </select>
            <button type="submit" className="btn-solid-blue px-6">
              Search
            </button>
          </form>
        </motion.div>

        <motion.div variants={fadeInUp} className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <UserCheck size={20} className="text-gov-blue" /> Registered Users
            </h2>
          </div>
          <div className="premium-table-wrapper">
            {loading ? (
              <div className="flex-center py-10">
                <div className="spinner"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <UserX size={32} />
                </div>
                <h3>No users found</h3>
                <p>Try adjusting your search filters.</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name / Email</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td
                        style={{ fontWeight: 600, color: "var(--text-muted)" }}
                      >
                        {u.userId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div
                          style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                          {u.email}
                        </div>
                      </td>
                      <td>{u.mobile}</td>
                      <td>
                        <span
                          className={`status-badge ${u.status === "active" ? "approved" : u.status === "suspended" ? "rejected" : "pending"}`}
                        >
                          {u.status === "active" && <UserCheck size={12} />}
                          {u.status === "suspended" && <UserX size={12} />}
                          {u.status === "pending_verification" && (
                            <Clock size={12} />
                          )}
                          {u.status.replace("_", " ")}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="premium-input"
                          style={{
                            height: "36px",
                            padding: "0 12px",
                            fontSize: "13px",
                          }}
                          onChange={(e) =>
                            handleStatusChange(u.id, e.target.value)
                          }
                          value={u.status}
                        >
                          <option value="active">Set Active</option>
                          <option value="suspended">Suspend User</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && pagination.total > 0 && (
            <div
              className="p-4 border-t flex justify-between items-center"
              style={{ borderColor: "rgba(128,128,128,0.1)" }}
            >
              <span className="text-sm text-muted">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </span>
              <div className="flex gap-2">
                <button
                  className="btn-outline-glow px-4 py-1"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                >
                  Previous
                </button>
                <button
                  className="btn-outline-glow px-4 py-1"
                  disabled={
                    pagination.page * pagination.limit >= pagination.total
                  }
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
