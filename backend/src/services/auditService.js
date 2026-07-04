const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Log admin activity for audit trail
 */
async function logActivity(
  adminId,
  action,
  targetType,
  targetId,
  description,
  req,
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetType: targetType || null,
        targetId: targetId || null,
        description: description || null,
        ipAddress: req?.ip || req?.connection?.remoteAddress || null,
        userAgent: req?.headers?.["user-agent"] || null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
}

module.exports = { logActivity };
