import React, { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import toast from "react-hot-toast";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../Dashboard.css";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [selectedApp, setSelectedApp] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [pagination.page, filterStatus, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus,
        search: searchTerm,
      };
      const res = await adminService.getApplications(params);
      setApplications(res.data.data.applications);
      setPagination(res.data.meta);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminService.updateApplicationStatus(id, {
        status: newStatus,
        remarks,
      });
      toast.success(`Application marked as ${newStatus}`);
      setSelectedApp(null);
      setRemarks("");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchApplications();
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
          <h1 className="dashboard-title">Manage Applications</h1>
          <p className="dashboard-subtitle">
            Review, approve, and reject citizen service requests
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
                placeholder="Search by application number or applicant name..."
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button type="submit" className="btn-solid-blue px-6">
              Search
            </button>
          </form>
        </motion.div>

        <div className="flex gap-6 items-start">
          <motion.div
            variants={fadeInUp}
            className={`dashboard-panel flex-1 transition-all ${selectedApp ? "w-2/3" : "w-full"}`}
          >
            <div className="panel-header">
              <h2 className="panel-title">
                <FileText size={20} className="text-gov-blue" /> Applications
                Queue
              </h2>
            </div>
            <div className="premium-table-wrapper">
              {loading ? (
                <div className="flex-center py-10">
                  <div className="spinner"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <FileText size={32} />
                  </div>
                  <h3>No applications found</h3>
                  <p>Try adjusting your search filters.</p>
                </div>
              ) : (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>App Number</th>
                      <th>Applicant</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        style={
                          selectedApp?.id === app.id
                            ? { background: "rgba(59, 130, 246, 0.05)" }
                            : {}
                        }
                      >
                        <td
                          style={{
                            fontWeight: 600,
                            color: "var(--text-muted)",
                          }}
                        >
                          {app.applicationNumber}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700 }}>
                            {app.user?.name}
                          </div>
                          <div
                            style={{ fontSize: 13, color: "var(--text-muted)" }}
                          >
                            {app.user?.email}
                          </div>
                        </td>
                        <td>
                          {app.service?.name?.substring(0, 25) +
                            (app.service?.name?.length > 25 ? "..." : "")}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${app.status === "approved" ? "approved" : app.status === "rejected" ? "rejected" : "pending"}`}
                          >
                            {app.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn-outline-glow px-3 py-1 text-sm flex items-center gap-2"
                            onClick={() => {
                              setSelectedApp(app);
                              setRemarks(app.remarks || "");
                            }}
                          >
                            <Eye size={14} /> Review
                          </button>
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
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total}
                </span>
                <div className="flex gap-2">
                  <button
                    className="btn-outline-glow px-4 py-1"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: pagination.page - 1,
                      })
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
                      setPagination({
                        ...pagination,
                        page: pagination.page + 1,
                      })
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {selectedApp && (
              <motion.div
                className="dashboard-panel w-1/3 shrink-0 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div
                  className="panel-header bg-gradient-to-r from-blue-900 to-blue-700 text-white"
                  style={{
                    background: "linear-gradient(135deg, #00508a, #002244)",
                  }}
                >
                  <h2 className="panel-title text-white">
                    <Eye size={20} /> Review Application
                  </h2>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-white hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="panel-body space-y-6">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Application Number
                    </div>
                    <div className="text-xl font-bold">
                      {selectedApp.applicationNumber}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Applicant
                      </div>
                      <div className="font-bold">{selectedApp.user?.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedApp.user?.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                        Current Status
                      </div>
                      <span
                        className={`status-badge ${selectedApp.status === "approved" ? "approved" : selectedApp.status === "rejected" ? "rejected" : "pending"}`}
                      >
                        {selectedApp.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Service Requested
                    </div>
                    <div className="font-bold text-gov-blue">
                      {selectedApp.service?.name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Review Notes / Remarks
                    </div>
                    <textarea
                      className="premium-input w-full"
                      style={{
                        height: "100px",
                        resize: "vertical",
                        paddingTop: "12px",
                      }}
                      placeholder="Add official remarks here..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                    <button
                      className="btn-solid-blue w-full py-3 flex justify-center items-center gap-2"
                      style={{ background: "#10b981" }}
                      onClick={() =>
                        handleStatusUpdate(selectedApp.id, "approved")
                      }
                    >
                      <Check size={18} /> Approve Application
                    </button>
                    <button
                      className="btn-solid-blue w-full py-3 flex justify-center items-center gap-2"
                      style={{ background: "#ef4444" }}
                      onClick={() =>
                        handleStatusUpdate(selectedApp.id, "rejected")
                      }
                    >
                      <X size={18} /> Reject Application
                    </button>
                    {selectedApp.status === "pending" && (
                      <button
                        className="btn-outline-glow w-full py-3 flex justify-center items-center gap-2"
                        onClick={() =>
                          handleStatusUpdate(selectedApp.id, "in_progress")
                        }
                      >
                        <Clock size={18} /> Mark In Progress
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
