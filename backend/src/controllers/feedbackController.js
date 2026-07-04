const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');

const prisma = new PrismaClient();

/** POST /api/feedback */
const submitFeedback = async (req, res, next) => {
  try {
    const { serviceId, applicationId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return ApiResponse.error(res, 'Rating must be between 1 and 5', 400);
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        serviceId: serviceId ? parseInt(serviceId) : null,
        applicationId: applicationId ? parseInt(applicationId) : null,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    return ApiResponse.success(res, 'Thank you for your feedback!', { feedback }, 201);
  } catch (error) {
    next(error);
  }
};

/** GET /api/feedback/service/:id */
const getServiceFeedback = async (req, res, next) => {
  try {
    const serviceId = parseInt(req.params.id);
    const { page = 1, limit = 10 } = req.query;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where: { serviceId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.feedback.count({ where: { serviceId } }),
    ]);

    // Calculate average rating
    const avgResult = await prisma.feedback.aggregate({
      where: { serviceId },
      _avg: { rating: true },
      _count: true,
    });

    return ApiResponse.paginated(res, 'Feedback retrieved', {
      feedbacks,
      averageRating: avgResult._avg.rating || 0,
      totalReviews: avgResult._count,
    }, { page: parseInt(page), limit: parseInt(limit), total });
  } catch (error) {
    next(error);
  }
};

/** GET /api/feedback/my */
const getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return ApiResponse.success(res, 'Your feedback retrieved', { feedbacks });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitFeedback, getServiceFeedback, getMyFeedback };
