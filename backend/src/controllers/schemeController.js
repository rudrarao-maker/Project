const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/** GET /api/schemes */
const getAllSchemes = async (req, res, next) => {
  try {
    const { state, category, search, page = 1, limit = 50 } = req.query;

    const where = { status: "active" };
    if (state && state !== "all") where.state = state;
    if (category && category !== "all") where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [schemes, total] = await Promise.all([
      prisma.scheme.findMany({
        where,
        orderBy: [{ state: "asc" }, { name: "asc" }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.scheme.count({ where }),
    ]);

    return ApiResponse.paginated(
      res,
      "Schemes retrieved successfully",
      { schemes },
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

/** GET /api/schemes/:id */
const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { createdBy: { select: { name: true, department: true } } },
    });
    if (!scheme) return ApiResponse.error(res, "Scheme not found", 404);
    return ApiResponse.success(res, "Scheme retrieved", { scheme });
  } catch (error) {
    next(error);
  }
};

/** POST /api/schemes/:id/save */
const saveScheme = async (req, res, next) => {
  try {
    const schemeId = parseInt(req.params.id);
    await prisma.userSavedScheme.create({
      data: { userId: req.user.id, schemeId },
    });
    return ApiResponse.success(res, "Scheme saved", null, 201);
  } catch (error) {
    if (error.code === "P2002")
      return ApiResponse.error(res, "Scheme already saved", 409);
    next(error);
  }
};

/** DELETE /api/schemes/:id/save */
const unsaveScheme = async (req, res, next) => {
  try {
    const schemeId = parseInt(req.params.id);
    await prisma.userSavedScheme.deleteMany({
      where: { userId: req.user.id, schemeId },
    });
    return ApiResponse.success(res, "Scheme unsaved");
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSchemes, getSchemeById, saveScheme, unsaveScheme };
