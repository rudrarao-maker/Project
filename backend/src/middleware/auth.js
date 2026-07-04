const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const config = require("../config");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/**
 * Authenticate JWT token from HttpOnly cookie or Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header
    let token = req.cookies?.[config.cookie.name];

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return ApiResponse.error(res, "Access denied. No token provided.", 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    // Check if user or admin
    if (
      decoded.role &&
      ["super_admin", "admin", "officer", "reviewer"].includes(decoded.role)
    ) {
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          adminId: true,
          name: true,
          email: true,
          role: true,
          status: true,
          department: true,
        },
      });
      if (!admin || admin.status !== "active") {
        return ApiResponse.error(res, "Account is not active.", 401);
      }
      req.user = { ...admin, isAdmin: true };
    } else {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          status: true,
          mobile: true,
        },
      });
      if (!user || user.status === "suspended") {
        return ApiResponse.error(
          res,
          "Account is suspended or not found.",
          401,
        );
      }
      req.user = { ...user, role: "user", isAdmin: false };
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Token has expired.", 401);
    }
    if (error.name === "JsonWebTokenError") {
      return ApiResponse.error(res, "Invalid token.", 401);
    }
    return ApiResponse.error(res, "Authentication failed.", 500);
  }
};

/**
 * Authorize admin roles
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return ApiResponse.error(res, "Access denied. Admin only.", 403);
  }
  next();
};

/**
 * Authorize specific roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        "Access denied. Insufficient permissions.",
        403,
      );
    }
    next();
  };
};

module.exports = { authenticate, authorizeAdmin, authorizeRoles };
