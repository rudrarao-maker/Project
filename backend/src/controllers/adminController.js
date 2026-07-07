const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");
const { sendEmail, templates } = require("../services/emailService");
const { logActivity } = require("../services/auditService");
const { appendQRAndSignatureToPDF } = require("../utils/documentUtils");

const prisma = new PrismaClient();

/** GET /api/admin/dashboard - Mirrors dashboard_stats.php */
const getDashboardStats = async (req, res, next) => {
  try {
    // Overview counts
    const [
      totalUsers,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      totalServices,
      totalSchemes,
      pendingDocuments,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.application.count({ where: { deletedAt: null } }),
      prisma.application.count({
        where: { status: "pending", deletedAt: null },
      }),
      prisma.application.count({
        where: { status: "approved", deletedAt: null },
      }),
      prisma.application.count({
        where: { status: "rejected", deletedAt: null },
      }),
      prisma.service.count({ where: { status: "active" } }),
      prisma.scheme.count({ where: { status: "active" } }),
      prisma.document.count({ where: { status: "pending" } }),
    ]);

    const inProgressApplications = await prisma.application.count({
      where: { status: "in_progress", deletedAt: null },
    });
    const totalGrievances = await prisma.grievance.count();
    const openGrievances = await prisma.grievance.count({
      where: { status: "open" },
    });

    // Revenue from approved applications
    const revenueResult = await prisma.$queryRaw`
      SELECT COALESCE(SUM(s.fees), 0)::float as total
      FROM service_applications sa
      JOIN services s ON sa.service_id = s.id
      WHERE sa.status = 'approved'
    `;
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly data for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);
      const monthName = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const [users, applications] = await Promise.all([
        prisma.user.count({
          where: {
            createdAt: { gte: startOfMonth, lte: endOfMonth },
            deletedAt: null,
          },
        }),
        prisma.application.count({
          where: {
            createdAt: { gte: startOfMonth, lte: endOfMonth },
            deletedAt: null,
          },
        }),
      ]);

      monthlyData.push({ month: monthName, users, applications, revenue: 0 });
    }

    // New users this month
    const startOfCurrentMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const newUsersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfCurrentMonth }, deletedAt: null },
    });

    const applicationsThisMonth = await prisma.application.count({
      where: { createdAt: { gte: startOfCurrentMonth }, deletedAt: null },
    });

    // Recent applications
    const recentActivity = await prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        service: { select: { name: true } },
      },
    });

    // Top services
    const topServicesRaw = await prisma.$queryRaw`
      SELECT s.name, COUNT(sa.id)::int as count
      FROM services s
      LEFT JOIN service_applications sa ON s.id = sa.service_id
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT 5
    `;

    // Status distribution
    const statusDistribution = {
      pending: pendingApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
      in_progress: inProgressApplications,
    };

    return ApiResponse.success(res, "Dashboard statistics retrieved", {
      overview: {
        totalUsers,
        totalApplications,
        totalServices,
        totalSchemes,
        totalRevenue,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        pendingDocuments,
        newUsersThisMonth,
        applicationsThisMonth,
        totalGrievances,
        openGrievances,
      },
      monthlyData,
      recentActivity: recentActivity.map((a) => ({
        type: "application",
        applicationNumber: a.applicationNumber,
        status: a.status,
        createdAt: a.createdAt,
        userName: a.user.name,
        serviceName: a.service.name,
      })),
      topServices: topServicesRaw,
      statusDistribution,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/advanced-analytics */
const getAdvancedAnalytics = async (req, res, next) => {
  try {
    // 1. User Demographics (Example: Active vs Inactive)
    const userStatusCounts = await prisma.user.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // 2. Applications by Service
    const applicationsByServiceRaw = await prisma.$queryRaw`
      SELECT s.name, COUNT(sa.id)::int as count
      FROM services s
      LEFT JOIN service_applications sa ON s.id = sa.service_id
      GROUP BY s.id, s.name
      ORDER BY count DESC
    `;

    // 3. Application Approval Rate over time (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsLast30Days = await prisma.application.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { status: true, createdAt: true }
    });

    const approvalRateData = applicationsLast30Days.reduce((acc, app) => {
      const date = app.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { total: 0, approved: 0 };
      acc[date].total++;
      if (app.status === 'approved') acc[date].approved++;
      return acc;
    }, {});

    // Format for charts
    const timeSeriesData = Object.entries(approvalRateData).map(([date, data]) => ({
      date,
      approvalRate: data.total > 0 ? (data.approved / data.total) * 100 : 0,
      total: data.total
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Grievance Status
    const grievanceStatusCounts = await prisma.grievance.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    return ApiResponse.success(res, "Advanced analytics retrieved", {
      userDemographics: userStatusCounts,
      applicationsByService: applicationsByServiceRaw,
      approvalRateTimeSeries: timeSeriesData,
      grievances: grievanceStatusCounts,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/users */
const getAllUsers = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const where = { deletedAt: null };
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { userId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          mobile: true,
          aadhaarNumber: true,
          status: true,
          createdAt: true,
          lastLogin: true,
          _count: { select: { applications: true, documents: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Users retrieved",
      { users },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/users/:id/status */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const userId = parseInt(req.params.id);

    if (!["active", "inactive", "suspended"].includes(status)) {
      return ApiResponse.error(res, "Invalid status", 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, userId: true, name: true, status: true },
    });

    await logActivity(
      req.user.id,
      "toggle_user_status",
      "user",
      userId,
      `Changed user status to ${status}`,
      req,
    );

    return ApiResponse.success(res, "User status updated successfully", {
      user,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/applications */
const getAllApplications = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const where = { deletedAt: null };
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { applicationNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, userId: true } },
          service: { select: { name: true, category: true } },
          assignedTo: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.application.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Applications retrieved",
      { applications },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/applications/:id/status */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const applicationId = parseInt(req.params.id);

    if (
      ![
        "pending",
        "in_progress",
        "approved",
        "rejected",
        "on_hold",
        "document_verification",
        "payment_pending",
        "completed",
      ].includes(status)
    ) {
      return ApiResponse.error(res, "Invalid status", 400);
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { name: true } },
      },
    });
    if (!application)
      return ApiResponse.error(res, "Application not found", 404);

    await prisma.application.update({
      where: { id: applicationId },
      data: { status, remarks: remarks || null },
    });

    // Send email notification
    if (["approved", "rejected"].includes(status)) {
      const t = templates.applicationStatusUpdate(
        application.user.name,
        application.service.name,
        application.applicationNumber,
        status,
        remarks,
      );
      sendEmail(application.user.email, t.subject, t.html).catch(() => {});

      // Create in-app notification
      await prisma.notification.create({
        data: {
          userId: application.user.id,
          recipientType: "user",
          type: "in_app",
          recipient: application.user.email,
          subject: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your application ${application.applicationNumber} for ${application.service.name} has been ${status}.${remarks ? " Remarks: " + remarks : ""}`,
          status: "sent",
        },
      });
    }

    await logActivity(
      req.user.id,
      "update_application_status",
      "application",
      applicationId,
      `Status changed to ${status}`,
      req,
    );

    return ApiResponse.success(res, "Application status updated", {
      status,
      applicationNumber: application.applicationNumber,
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/applications/bulk-status */
const bulkUpdateApplicationStatus = async (req, res, next) => {
  try {
    const { ids, status, remarks } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return ApiResponse.error(res, "Application IDs array is required", 400);
    }

    if (
      !["pending", "in_progress", "approved", "rejected", "on_hold"].includes(
        status,
      )
    ) {
      return ApiResponse.error(res, "Invalid status", 400);
    }

    await prisma.application.updateMany({
      where: { id: { in: ids.map((id) => parseInt(id)) } },
      data: { status, remarks: remarks || null },
    });

    await logActivity(
      req.user.id,
      "bulk_update_status",
      "application",
      null,
      `Bulk updated ${ids.length} applications to ${status}`,
      req,
    );

    return ApiResponse.success(
      res,
      `${ids.length} applications updated to ${status}`,
    );
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/documents/pending */
const getPendingDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const where = { status: "pending" };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, userId: true } },
        },
        orderBy: { uploadedAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.document.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Pending documents retrieved",
      { documents },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/documents/:id/review */
const reviewDocument = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const documentId = parseInt(req.params.id);

    if (!["approved", "rejected"].includes(status)) {
      return ApiResponse.error(res, "Status must be approved or rejected", 400);
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!document) return ApiResponse.error(res, "Document not found", 404);

    let updatedFilePath = document.filePath;
    if (status === "approved" && document.filePath) {
      try {
        const result = await appendQRAndSignatureToPDF(document.filePath, document.id, document.user.id);
        if (result && result.certPath) {
          updatedFilePath = result.certPath;
        }
      } catch (err) {
        console.error("Failed to append QR/Signature:", err);
      }
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        adminRemarks: remarks || null,
        reviewedById: req.user.id,
        reviewedAt: new Date(),
        filePath: updatedFilePath, // update if modified
      },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: document.user.id,
        recipientType: "user",
        type: "in_app",
        recipient: document.user.email,
        subject: `Document ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your document "${document.documentType}" has been ${status}.${remarks ? " Remarks: " + remarks : ""}`,
        status: "sent",
      },
    });

    await logActivity(
      req.user.id,
      "review_document",
      "document",
      documentId,
      `Document ${status}`,
      req,
    );

    return ApiResponse.success(res, `Document ${status} successfully`);
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/audit-log */
const getAuditLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: { admin: { select: { name: true, adminId: true } } },
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.auditLog.count(),
    ]);

    return ApiResponse.paginated(
      res,
      "Audit log retrieved",
      { logs },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** POST /api/admin/news */
const createNews = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content)
      return ApiResponse.error(res, "Title and content are required", 400);

    const news = await prisma.news.create({
      data: {
        title,
        content,
        category: category || null,
        isActive: true,
        publishedAt: new Date(),
      },
    });

    await logActivity(
      req.user.id,
      "create_news",
      "news",
      news.id,
      `Created news: ${title}`,
      req,
    );
    return ApiResponse.success(res, "News created", { news }, 201);
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/contact-messages */
const getContactMessages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status && status !== "all") where.status = status;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Contact messages retrieved",
      { messages },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/contact-messages/:id/status */
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const id = parseInt(req.params.id);

    if (!["new", "in_progress", "resolved", "closed"].includes(status)) {
      return ApiResponse.error(res, "Invalid status", 400);
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { status, respondedById: req.user.id, respondedAt: new Date() },
    });

    return ApiResponse.success(res, "Contact message status updated");
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADMIN CRUD — Services
// ============================================================================

/** POST /api/admin/services */
const createService = async (req, res, next) => {
  try {
    const {
      serviceCode,
      name,
      description,
      category,
      department,
      requiredDocuments,
      processingTime,
      fees,
      officialWebsite,
      logoUrl,
    } = req.body;
    if (!serviceCode || !name)
      return ApiResponse.error(res, "Service code and name are required", 400);

    const service = await prisma.service.create({
      data: {
        serviceCode,
        name,
        description,
        category,
        department,
        requiredDocuments,
        processingTime,
        fees: fees || 0,
        officialWebsite,
        logoUrl,
        createdById: req.user.id,
      },
    });

    await logActivity(
      req.user.id,
      "create_service",
      "service",
      service.id,
      `Created service: ${name}`,
      req,
    );
    return ApiResponse.success(res, "Service created", { service }, 201);
  } catch (error) {
    if (error.code === "P2002")
      return ApiResponse.error(res, "Service code already exists", 409);
    next(error);
  }
};

/** PUT /api/admin/services/:id */
const updateService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    delete data.id;

    const service = await prisma.service.update({ where: { id }, data });
    await logActivity(
      req.user.id,
      "update_service",
      "service",
      id,
      `Updated service: ${service.name}`,
      req,
    );
    return ApiResponse.success(res, "Service updated", { service });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/admin/services/:id */
const deleteService = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.service.update({
      where: { id },
      data: { status: "inactive" },
    });
    await logActivity(
      req.user.id,
      "delete_service",
      "service",
      id,
      "Deactivated service",
      req,
    );
    return ApiResponse.success(res, "Service deactivated");
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/services */
const getAdminServices = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { serviceCode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.service.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Services retrieved",
      { services },
      { page: parseInt(page), limit: parseInt(limit), total },
    );
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADMIN CRUD — Schemes
// ============================================================================

/** POST /api/admin/schemes */
const createScheme = async (req, res, next) => {
  try {
    const {
      schemeCode,
      name,
      description,
      category,
      eligibility,
      benefits,
      state,
      department,
      applicationFee,
      officialWebsite,
      logoUrl,
      startDate,
      endDate,
    } = req.body;
    if (!schemeCode || !name)
      return ApiResponse.error(res, "Scheme code and name are required", 400);

    const scheme = await prisma.scheme.create({
      data: {
        schemeCode,
        name,
        description,
        category,
        eligibility,
        benefits,
        state,
        department,
        applicationFee: applicationFee || 0,
        officialWebsite,
        logoUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdById: req.user.id,
      },
    });

    await logActivity(
      req.user.id,
      "create_scheme",
      "scheme",
      scheme.id,
      `Created scheme: ${name}`,
      req,
    );
    return ApiResponse.success(res, "Scheme created", { scheme }, 201);
  } catch (error) {
    if (error.code === "P2002")
      return ApiResponse.error(res, "Scheme code already exists", 409);
    next(error);
  }
};

/** PUT /api/admin/schemes/:id */
const updateScheme = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = { ...req.body };
    delete data.id;
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const scheme = await prisma.scheme.update({ where: { id }, data });
    await logActivity(
      req.user.id,
      "update_scheme",
      "scheme",
      id,
      `Updated scheme: ${scheme.name}`,
      req,
    );
    return ApiResponse.success(res, "Scheme updated", { scheme });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/admin/schemes/:id */
const deleteScheme = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.scheme.update({ where: { id }, data: { status: "inactive" } });
    await logActivity(
      req.user.id,
      "delete_scheme",
      "scheme",
      id,
      "Deactivated scheme",
      req,
    );
    return ApiResponse.success(res, "Scheme deactivated");
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/schemes */
const getAdminSchemes = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { schemeCode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [schemes, total] = await Promise.all([
      prisma.scheme.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.scheme.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Schemes retrieved",
      { schemes },
      { page: parseInt(page), limit: parseInt(limit), total },
    );
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADMIN CRUD — Jobs
// ============================================================================

/** POST /api/admin/jobs */
const createJob = async (req, res, next) => {
  try {
    const {
      jobCode,
      title,
      department,
      state,
      category,
      qualification,
      ageLimit,
      deadline,
      salary,
      jobType,
      description,
      officialWebsite,
      logoUrl,
      notificationPdf,
    } = req.body;
    if (!jobCode || !title || !department || !state)
      return ApiResponse.error(
        res,
        "Job code, title, department, and state are required",
        400,
      );

    const job = await prisma.job.create({
      data: {
        jobCode,
        title,
        department,
        state,
        category,
        qualification,
        ageLimit,
        deadline: deadline ? new Date(deadline) : null,
        salary,
        jobType,
        description,
        officialWebsite,
        logoUrl,
        notificationPdf,
      },
    });

    await logActivity(
      req.user.id,
      "create_job",
      "job",
      job.id,
      `Created job: ${title}`,
      req,
    );
    return ApiResponse.success(res, "Job created", { job }, 201);
  } catch (error) {
    if (error.code === "P2002")
      return ApiResponse.error(res, "Job code already exists", 409);
    next(error);
  }
};

/** PUT /api/admin/jobs/:id */
const updateJob = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = { ...req.body };
    delete data.id;
    if (data.deadline) data.deadline = new Date(data.deadline);

    const job = await prisma.job.update({ where: { id }, data });
    await logActivity(
      req.user.id,
      "update_job",
      "job",
      id,
      `Updated job: ${job.title}`,
      req,
    );
    return ApiResponse.success(res, "Job updated", { job });
  } catch (error) {
    next(error);
  }
};

/** DELETE /api/admin/jobs/:id */
const deleteJob = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.job.update({ where: { id }, data: { isActive: false } });
    await logActivity(
      req.user.id,
      "delete_job",
      "job",
      id,
      "Deactivated job",
      req,
    );
    return ApiResponse.success(res, "Job deactivated");
  } catch (error) {
    next(error);
  }
};

/** GET /api/admin/jobs */
const getAdminJobs = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { jobCode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.job.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Jobs retrieved",
      { jobs },
      { page: parseInt(page), limit: parseInt(limit), total },
    );
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADMIN — Grievances
// ============================================================================

/** GET /api/admin/grievances */
const getAdminGrievances = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status && status !== "all") where.status = status;
    if (priority && priority !== "all") where.priority = priority;

    const [grievances, total] = await Promise.all([
      prisma.grievance.findMany({
        where,
        include: {
          user: { select: { name: true, email: true, userId: true } },
          application: { select: { applicationNumber: true } },
          assignedTo: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.grievance.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Grievances retrieved",
      { grievances },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    );
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/grievances/:id/status */
const updateGrievanceStatus = async (req, res, next) => {
  try {
    const { status, resolution, assignedToId, priority } = req.body;
    const id = parseInt(req.params.id);

    const data = {};
    if (status) data.status = status;
    if (resolution) data.resolution = resolution;
    if (assignedToId) data.assignedToId = parseInt(assignedToId);
    if (priority) data.priority = priority;
    if (status === "resolved") data.resolvedAt = new Date();

    const grievance = await prisma.grievance.update({
      where: { id },
      data,
      include: { user: { select: { name: true, email: true } } },
    });

    // Notify user
    if (status) {
      const t = templates.grievanceStatusUpdate(
        grievance.user.name,
        grievance.grievanceNumber,
        status,
        resolution,
      );
      sendEmail(grievance.user.email, t.subject, t.html).catch(() => {});
    }

    await logActivity(
      req.user.id,
      "update_grievance",
      "grievance",
      id,
      `Grievance status: ${status || "updated"}`,
      req,
    );
    return ApiResponse.success(res, "Grievance updated");
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// ADMIN — Roles & Permissions
// ============================================================================

/** GET /api/admin/roles */
const getAdminRoles = async (req, res, next) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        adminId: true,
        name: true,
        email: true,
        role: true,
        department: true,
        designation: true,
        permissions: true,
        status: true,
        lastLogin: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(res, "Admin roles retrieved", { admins });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/admin/admins/:id/permissions */
const updateAdminPermissions = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { permissions, role } = req.body;

    const data = {};
    if (permissions) data.permissions = permissions;
    if (role) data.role = role;

    const admin = await prisma.admin.update({ where: { id }, data });
    await logActivity(
      req.user.id,
      "update_admin_permissions",
      "admin",
      id,
      `Updated permissions for ${admin.name}`,
      req,
    );
    return ApiResponse.success(res, "Admin permissions updated", {
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
