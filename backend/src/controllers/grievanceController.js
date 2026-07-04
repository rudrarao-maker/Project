const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');
const { generateGrievanceNumber } = require('../utils/generateId');
const { sendEmail, templates } = require('../services/emailService');

const prisma = new PrismaClient();

/** POST /api/grievances */
const submitGrievance = async (req, res, next) => {
  try {
    const { subject, description, category, applicationId } = req.body;

    if (!subject || !description) {
      return ApiResponse.error(res, 'Subject and description are required', 400);
    }

    const grievanceNumber = generateGrievanceNumber();

    const grievance = await prisma.grievance.create({
      data: {
        userId: req.user.id,
        applicationId: applicationId ? parseInt(applicationId) : null,
        grievanceNumber,
        subject,
        description,
        category: category || null,
        status: 'open',
        priority: 'medium',
      },
    });

    // Send email notification
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      const t = templates.grievanceSubmitted(user.name, grievanceNumber);
      sendEmail(user.email, t.subject, t.html).catch(() => {});
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        recipientType: 'user',
        type: 'in_app',
        recipient: user?.email || '',
        subject: 'Grievance Registered',
        message: `Your grievance ${grievanceNumber} has been registered. We will review it shortly.`,
        status: 'sent',
      },
    });

    return ApiResponse.success(res, 'Grievance submitted successfully', {
      grievanceNumber,
      id: grievance.id,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/** GET /api/grievances */
const getMyGrievances = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (status && status !== 'all') where.status = status;

    const [grievances, total] = await Promise.all([
      prisma.grievance.findMany({
        where,
        include: {
          application: { select: { applicationNumber: true, service: { select: { name: true } } } },
          assignedTo: { select: { name: true, department: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.grievance.count({ where }),
    ]);

    return ApiResponse.paginated(res, 'Grievances retrieved', { grievances }, {
      page: parseInt(page), limit: parseInt(limit), total,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /api/grievances/:id */
const getGrievanceById = async (req, res, next) => {
  try {
    const grievance = await prisma.grievance.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: {
        application: { select: { applicationNumber: true, service: { select: { name: true } } } },
        assignedTo: { select: { name: true, department: true } },
      },
    });

    if (!grievance) return ApiResponse.error(res, 'Grievance not found', 404);
    return ApiResponse.success(res, 'Grievance retrieved', { grievance });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitGrievance, getMyGrievances, getGrievanceById };
