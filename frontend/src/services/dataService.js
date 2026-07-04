import api from "./api";

export const authService = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  verifyOTP: (data) => api.post("/auth/verify-otp", data),
  resendOTP: (data) => api.post("/auth/resend-otp", data),
  login2FA: (data) => api.post("/auth/login-2fa", data),
  setup2FA: () => api.post("/auth/setup-2fa"),
  verify2FASetup: (data) => api.post("/auth/verify-2fa-setup", data),
};

export const serviceService = {
  getAll: (params) => api.get("/services", { params }),
  getById: (id) => api.get(`/services/${id}`),
};

export const schemeService = {
  getAll: (params) => api.get("/schemes", { params }),
  getById: (id) => api.get(`/schemes/${id}`),
  save: (id) => api.post(`/schemes/${id}/save`),
  unsave: (id) => api.delete(`/schemes/${id}/save`),
};

export const jobService = {
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
};

export const applicationService = {
  submit: (data) => api.post("/applications", data),
  getAll: (params) => api.get("/applications", { params }),
  getById: (id) => api.get(`/applications/${id}`),
  update: (id, data) => api.put(`/applications/${id}`, data),
};

export const documentService = {
  upload: (formData) =>
    api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: () => api.get("/documents"),
  getById: (id) => api.get(`/documents/${id}`),
  download: (id) =>
    api.get(`/documents/${id}/download`, { responseType: "blob" }),
};

export const notificationService = {
  getAll: (params) => api.get("/notifications", { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  toggleUserStatus: (id, status) =>
    api.put(`/admin/users/${id}/status`, { status }),
  getApplications: (params) => api.get("/admin/applications", { params }),
  updateApplicationStatus: (id, data) =>
    api.put(`/admin/applications/${id}/status`, data),
  bulkUpdateStatus: (data) => api.put("/admin/applications/bulk-status", data),
  getPendingDocuments: (params) =>
    api.get("/admin/documents/pending", { params }),
  reviewDocument: (id, data) => api.put(`/admin/documents/${id}/review`, data),
  getAuditLog: (params) => api.get("/admin/audit-log", { params }),
  createNews: (data) => api.post("/admin/news", data),
  getContactMessages: (params) =>
    api.get("/admin/contact-messages", { params }),
  updateContactMessageStatus: (id, status) =>
    api.put(`/admin/contact-messages/${id}/status`, { status }),
  // Services CRUD
  getServices: (params) => api.get("/admin/services", { params }),
  createService: (data) => api.post("/admin/services", data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  // Schemes CRUD
  getSchemes: (params) => api.get("/admin/schemes", { params }),
  createScheme: (data) => api.post("/admin/schemes", data),
  updateScheme: (id, data) => api.put(`/admin/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/admin/schemes/${id}`),
  // Jobs CRUD
  getJobs: (params) => api.get("/admin/jobs", { params }),
  createJob: (data) => api.post("/admin/jobs", data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  // Grievances
  getGrievances: (params) => api.get("/admin/grievances", { params }),
  updateGrievanceStatus: (id, data) =>
    api.put(`/admin/grievances/${id}/status`, data),
  // Roles
  getAdminRoles: () => api.get("/admin/roles"),
  updateAdminPermissions: (id, data) =>
    api.put(`/admin/admins/${id}/permissions`, data),
};

export const publicService = {
  getNews: (params) => api.get("/news", { params }),
  submitContact: (data) => api.post("/contact", data),
};

export const paymentService = {
  downloadReceipt: (applicationId) =>
    api.get(`/payments/${applicationId}/receipt`, { responseType: "blob" }),
};

export const faqService = {
  getAll: (params) => api.get("/faqs", { params }),
  create: (data) => api.post("/faqs", data),
};

export const trackService = {
  trackApplication: (applicationNumber) =>
    api.get(`/track/${applicationNumber}`),
};

export const searchService = {
  search: (params) => api.get("/search", { params }),
  suggest: (params) => api.get("/search/suggest", { params }),
};

export const grievanceService = {
  submit: (data) => api.post("/grievances", data),
  getAll: (params) => api.get("/grievances", { params }),
  getById: (id) => api.get(`/grievances/${id}`),
};

export const feedbackService = {
  submit: (data) => api.post("/feedback", data),
  getServiceFeedback: (serviceId, params) =>
    api.get(`/feedback/service/${serviceId}`, { params }),
  getMyFeedback: () => api.get("/feedback/my"),
};

export const appointmentService = {
  book: (data) => api.post("/appointments", data),
  getAll: (params) => api.get("/appointments", { params }),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const userActivityService = {
  getLoginHistory: (params) => api.get("/users/login-history", { params }),
  getActivity: () => api.get("/users/activity"),
};

export const walletService = {
  getWallet: () => api.get("/wallet"),
  addFunds: (data) => api.post("/wallet/add-funds", data),
};

export const lockerService = {
  getAll: () => api.get("/locker"),
  upload: (formData) =>
    api.post("/locker", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/locker/${id}`),
};

export const chatService = {
  getHistory: () => api.get("/chat/history"),
};
