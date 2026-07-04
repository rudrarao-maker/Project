const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');
const { generateApplicationNumber } = require('../utils/generateId');
const { sendEmail, templates } = require('../services/emailService');

const prisma = new PrismaClient();

/** POST /api/applications */
const submitApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return ApiResponse.error(res, 'Validation failed', 400, errors.array());

    const { serviceId, data } = req.body;

    // Verify service exists
    const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
    if (!service) return ApiResponse.error(res, 'Invalid service', 404);

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        serviceId: parseInt(serviceId),
        applicationNumber,
        submittedData: data || {},
        status: 'pending',
        priority: 'medium',
      },
      include: { service: { select: { name: true } } },
    });

    // Send email notification
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      const t = templates.applicationSubmitted(user.name, service.name, applicationNumber);
      sendEmail(user.email, t.subject, t.html).catch(() => {});
    }

    // Create in-app notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        recipientType: 'user',
        type: 'in_app',
        recipient: user?.email || '',
        subject: 'Application Submitted',
        message: `Your application for ${service.name} has been submitted. Application No: ${applicationNumber}`,
        status: 'sent',
      },
    });

    return ApiResponse.success(res, 'Application submitted successfully!', {
      applicationId: application.id,
      applicationNumber,
      serviceName: service.name,
    }, 201);
  } catch (error) { next(error); }
};

/** GET /api/applications */
const getMyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = { userId: req.user.id, deletedAt: null };
    if (status && status !== 'all') where.status = status;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          service: { select: { name: true, category: true, department: true, fees: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.application.count({ where }),
    ]);

    return ApiResponse.paginated(res, 'Applications retrieved', { applications }, {
      page: parseInt(page), limit: parseInt(limit), total,
    });
  } catch (error) { next(error); }
};

/** GET /api/applications/:id */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id, deletedAt: null },
      include: {
        service: true,
        documents: true,
        assignedTo: { select: { name: true, department: true } },
      },
    });
    if (!application) return ApiResponse.error(res, 'Application not found', 404);
    return ApiResponse.success(res, 'Application retrieved', { application });
  } catch (error) { next(error); }
};

/** PUT /api/applications/:id */
const updateApplication = async (req, res, next) => {
  try {
    const { data } = req.body;

    const application = await prisma.application.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!application) return ApiResponse.error(res, 'Application not found', 404);
    if (application.status !== 'pending') {
      return ApiResponse.error(res, 'Only pending applications can be edited', 400);
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { submittedData: data || application.submittedData },
    });

    return ApiResponse.success(res, 'Application updated', { application: updated });
  } catch (error) { next(error); }
};

module.exports = { submitApplication, getMyApplications, getApplicationById, updateApplication };
