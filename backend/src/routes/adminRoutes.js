const router = require("express").Router();
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllApplications,
  updateApplicationStatus,
  bulkUpdateApplicationStatus,
  getPendingDocuments,
  reviewDocument,
  getAuditLog,
  createNews,
  getContactMessages,
  updateContactMessageStatus,
  createService,
  updateService,
  deleteService,
  getAdminServices,
  createScheme,
  updateScheme,
  deleteScheme,
  getAdminSchemes,
  createJob,
  updateJob,
  deleteJob,
  getAdminJobs,
  getAdminGrievances,
  updateGrievanceStatus,
  getAdminRoles,
  updateAdminPermissions,
  getAdvancedAnalytics,
} = require("../controllers/adminController");

const auditLogger = require("../middleware/auditLogger");

router.use(authenticate, authorizeAdmin, auditLogger);

// Dashboard
router.get("/dashboard", getDashboardStats);
router.get("/advanced-analytics", getAdvancedAnalytics);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/status", toggleUserStatus);

// Applications
router.get("/applications", getAllApplications);
router.put("/applications/:id/status", updateApplicationStatus);
router.put("/applications/bulk-status", bulkUpdateApplicationStatus);

// Documents
router.get("/documents/pending", getPendingDocuments);
router.put("/documents/:id/review", reviewDocument);

// Services CRUD
router.get("/services", getAdminServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Schemes CRUD
router.get("/schemes", getAdminSchemes);
router.post("/schemes", createScheme);
router.put("/schemes/:id", updateScheme);
router.delete("/schemes/:id", deleteScheme);

// Jobs CRUD
router.get("/jobs", getAdminJobs);
router.post("/jobs", createJob);
router.put("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

// Grievances
router.get("/grievances", getAdminGrievances);
router.put("/grievances/:id/status", updateGrievanceStatus);

// Roles & Permissions
router.get("/roles", getAdminRoles);
router.put("/admins/:id/permissions", updateAdminPermissions);

// Other
router.get("/audit-log", getAuditLog);
router.post("/news", createNews);
router.get("/contact-messages", getContactMessages);
router.put("/contact-messages/:id/status", updateContactMessageStatus);

module.exports = router;
