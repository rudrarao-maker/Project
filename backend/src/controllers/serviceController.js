const { PrismaClient } = require('@prisma/client');
const ApiResponse = require('../utils/apiResponse');

const prisma = new PrismaClient();

/** GET /api/services */
const getAllServices = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const where = { status: 'active' };
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.service.count({ where }),
    ]);

    return ApiResponse.paginated(res, 'Services retrieved successfully', { services }, {
      page: parseInt(page), limit: parseInt(limit), total,
    });
  } catch (error) { next(error); }
};

/** GET /api/services/:id */
const getServiceById = async (req, res, next) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { createdBy: { select: { name: true, department: true } } },
    });
    if (!service) return ApiResponse.error(res, 'Service not found', 404);
    return ApiResponse.success(res, 'Service retrieved', { service });
  } catch (error) { next(error); }
};

module.exports = { getAllServices, getServiceById };
