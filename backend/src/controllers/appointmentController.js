const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');
const { generateAppointmentNumber } = require('../utils/generateId');
const { sendEmail, templates } = require('../services/emailService');

const prisma = new PrismaClient();

/** POST /api/appointments */
const bookAppointment = async (req, res, next) => {
  try {
    const { serviceId, appointmentDate, timeSlot, officeLocation, purpose, notes } = req.body;

    if (!appointmentDate || !timeSlot) {
      return ApiResponse.error(res, 'Appointment date and time slot are required', 400);
    }

    // Validate date is in the future
    const apptDate = new Date(appointmentDate);
    if (apptDate <= new Date()) {
      return ApiResponse.error(res, 'Appointment date must be in the future', 400);
    }

    const confirmationNumber = generateAppointmentNumber();

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.id,
        serviceId: serviceId ? parseInt(serviceId) : null,
        confirmationNumber,
        appointmentDate: apptDate,
        timeSlot,
        officeLocation: officeLocation || null,
        purpose: purpose || null,
        notes: notes || null,
        status: 'scheduled',
      },
    });

    // Send confirmation email
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      const t = templates.appointmentConfirmation(user.name, appointment);
      sendEmail(user.email, t.subject, t.html).catch(() => {});
    }

    return ApiResponse.success(res, 'Appointment booked successfully', {
      confirmationNumber,
      id: appointment.id,
    }, 201);
  } catch (error) {
    next(error);
  }
};

/** GET /api/appointments */
const getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (status && status !== 'all') where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { appointmentDate: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.appointment.count({ where }),
    ]);

    return ApiResponse.paginated(res, 'Appointments retrieved', { appointments }, {
      page: parseInt(page), limit: parseInt(limit), total,
    });
  } catch (error) {
    next(error);
  }
};

/** PUT /api/appointments/:id/cancel */
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!appointment) return ApiResponse.error(res, 'Appointment not found', 404);
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return ApiResponse.error(res, 'Cannot cancel this appointment', 400);
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'cancelled' },
    });

    return ApiResponse.success(res, 'Appointment cancelled successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getMyAppointments, cancelAppointment };
