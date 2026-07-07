import React, { useState, useEffect } from "react";
import { adminService } from "../../services/dataService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // We assume you added getAdvancedAnalytics to adminService in frontend
      const res = await adminService.getAdvancedAnalytics();
      setData(res.data.data);
    } catch (error) {
      toast.error("Failed to load advanced analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="premium-dashboard flex-center"><div className="spinner"></div></div>;
  }

  const {
    userDemographics,
    applicationsByService,
    approvalRateTimeSeries,
    grievances,
  } = data;

  const approvalRateChart = {
    labels: approvalRateTimeSeries.map((d) => d.date),
    datasets: [
      {
        label: "Approval Rate (%)",
        data: approvalRateTimeSeries.map((d) => d.approvalRate),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const applicationsByServiceChart = {
    labels: applicationsByService.map((d) => d.name),
    datasets: [
      {
        label: "Applications",
        data: applicationsByService.map((d) => d.count),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  return (
    <motion.div
      className="premium-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-header">
        <div>
          <h1>Advanced Analytics</h1>
          <p>Deep insights into portal performance and usage</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="stat-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Application Approval Rate (Last 30 Days)</h3>
          <div style={{ height: "300px", marginTop: "16px" }}>
            <Line data={approvalRateChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="stat-card">
          <h3>Applications by Service</h3>
          <div style={{ height: "300px", marginTop: "16px" }}>
            <Bar data={applicationsByServiceChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Grievance Status Breakdown</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {grievances.map(g => (
               <li key={g.status} style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ textTransform: "capitalize" }}>{g.status.replace("_", " ")}</span>
                  <span style={{ fontWeight: 600 }}>{g._count.id}</span>
               </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
