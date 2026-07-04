const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');

const prisma = new PrismaClient();

/** GET /api/news */
const getNews = async (req, res, next) => {
  try {
    const { category, limit = 10 } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit),
    });
    return ApiResponse.success(res, 'News retrieved', { news });
  } catch (error) { next(error); }
};

/** POST /api/contact */
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return ApiResponse.error(res, 'Name, email, subject, and message are required', 400);
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message },
    });
    return ApiResponse.success(res, 'Message submitted successfully', { id: contactMessage.id }, 201);
  } catch (error) { next(error); }
};

module.exports = { getNews, submitContactMessage };
