import { useState, useEffect } from "react";
import { notificationService } from "../services/dataService";
import { Bell, CheckCircle2, Mail, Smartphone, Filter } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filter !== "all") params.type = filter;
      const res = await notificationService.getAll(params);
      setNotifications(res.data.data.notifications || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed");
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const typeIcon = {
    email: <Mail size={16} />,
    sms: <Smartphone size={16} />,
    in_app: <Bell size={16} />,
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700 }}>Notifications</h1>
          <p style={{ color: "var(--text-muted)" }}>
            {unreadCount} unread • {total} total
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-outline-glow"
            style={{ fontSize: "13px" }}
          >
            <CheckCircle2 size={16} /> Mark All Read
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["all", "in_app", "email", "sms"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background:
                filter === f ? "var(--accent-color, #3b82f6)" : "transparent",
              color: filter === f ? "white" : "var(--text-primary)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {f === "all" ? "All" : f === "in_app" ? "In-App" : f.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: "60px" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "8px" }}>
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "var(--text-muted)",
              }}
            >
              <Bell size={48} style={{ opacity: 0.3, marginBottom: "16px" }} />
              <h3>No notifications</h3>
            </div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => !n.isRead && markAsRead(n.id)}
                style={{
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: n.isRead
                    ? "var(--bg-secondary)"
                    : "rgba(59,130,246,0.05)",
                  border: `1px solid ${n.isRead ? "var(--border-color)" : "rgba(59,130,246,0.2)"}`,
                  cursor: n.isRead ? "default" : "pointer",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    background: "var(--bg-tertiary, rgba(128,128,128,0.1))",
                  }}
                >
                  {typeIcon[n.type] || <Bell size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    {n.subject}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    {n.message}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginTop: "6px",
                    }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.isRead && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#3b82f6",
                      marginTop: "8px",
                    }}
                  />
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
