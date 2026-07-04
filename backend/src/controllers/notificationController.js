const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');

const prisma = new PrismaClient();

/** GET /api/notifications */
const getNotifications = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;

    const where = { userId: req.user.id, recipientType: 'user' };
    if (type && type !== 'all') where.type = type;
    if (status && status !== 'all') where.status = status;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.user.id, isRead: false } }),
    ]);

    return ApiResponse.paginated(res, 'Notifications retrieved', { notifications, unreadCount }, {
      page: parseInt(page), limit: parseInt(limit), total,
    });
  } catch (error) { next(error); }
};

/** PUT /api/notifications/:id/read */
const markAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      data: { isRead: true, readAt: new Date() },
    });
    return ApiResponse.success(res, 'Notification marked as read');
  } catch (error) { next(error); }
};

/** PUT /api/notifications/read-all */
const markAllRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return ApiResponse.success(res, 'All notifications marked as read');
  } catch (error) { next(error); }
};

module.exports = { getNotifications, markAsRead, markAllRead };
