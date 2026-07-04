const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/**
 * GET /api/locker
 */
const getLockerItems = async (req, res, next) => {
  try {
    const items = await prisma.digitalLockerItem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(res, "Locker items retrieved", items);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/locker
 */
const addItem = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, "File is required", 400);
    }

    const { name, category, issuedBy } = req.body;

    const item = await prisma.digitalLockerItem.create({
      data: {
        userId: req.user.id,
        documentId: `DOC${Date.now()}`,
        name: name || req.file.originalname,
        category: category || "other",
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        issuedBy,
        isVerified: false, // Admin can verify later if needed
      },
    });

    return ApiResponse.success(res, "Document added to locker", item, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/locker/:id
 */
const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.digitalLockerItem.findUnique({ where: { id } });

    if (!item) return ApiResponse.error(res, "Item not found", 404);
    if (item.userId !== req.user.id)
      return ApiResponse.error(res, "Unauthorized", 403);

    await prisma.digitalLockerItem.delete({ where: { id } });

    // In a real app, also delete the physical file using fs.unlink

    return ApiResponse.success(res, "Item removed from locker");
  } catch (error) {
    next(error);
  }
};

module.exports = { getLockerItems, addItem, deleteItem };
