const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/** GET /api/users/login-history */
const getLoginHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [history, total] = await Promise.all([
      prisma.loginHistory.findMany({
        where: { userId: req.user.id },
        orderBy: { loginAt: "desc" },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.loginHistory.count({ where: { userId: req.user.id } }),
    ]);

    return ApiResponse.paginated(
      res,
      "Login history retrieved",
      { history },
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

/** GET /api/users/activity */
const getUserActivity = async (req, res, next) => {
  try {
    // Aggregate activity from multiple sources
    const [applications, documents, grievances, appointments] =
      await Promise.all([
        prisma.application.findMany({
          where: { userId: req.user.id, deletedAt: null },
          select: {
            id: true,
            applicationNumber: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            service: { select: { name: true } },
          },
          orderBy: { updatedAt: "desc" },
          take: 10,
        }),
        prisma.document.findMany({
          where: { userId: req.user.id },
          select: {
            id: true,
            documentType: true,
            documentName: true,
            status: true,
            uploadedAt: true,
          },
          orderBy: { uploadedAt: "desc" },
          take: 10,
        }),
        prisma.grievance.findMany({
          where: { userId: req.user.id },
          select: {
            id: true,
            grievanceNumber: true,
            subject: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.appointment.findMany({
          where: { userId: req.user.id },
          select: {
            id: true,
            confirmationNumber: true,
            appointmentDate: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    // Build a combined activity feed
    const activities = [
      ...applications.map((a) => ({
        type: "application",
        title: `Application ${a.applicationNumber}`,
        subtitle: a.service?.name,
        status: a.status,
        date: a.updatedAt,
      })),
      ...documents.map((d) => ({
        type: "document",
        title: `Document: ${d.documentType}`,
        subtitle: d.documentName,
        status: d.status,
        date: d.uploadedAt,
      })),
      ...grievances.map((g) => ({
        type: "grievance",
        title: `Grievance ${g.grievanceNumber}`,
        subtitle: g.subject,
        status: g.status,
        date: g.createdAt,
      })),
      ...appointments.map((a) => ({
        type: "appointment",
        title: `Appointment ${a.confirmationNumber}`,
        subtitle: new Date(a.appointmentDate).toLocaleDateString(),
        status: a.status,
        date: a.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return ApiResponse.success(res, "User activity retrieved", { activities });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLoginHistory, getUserActivity };
