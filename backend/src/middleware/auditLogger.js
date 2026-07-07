const { logActivity } = require("../services/auditService");

const auditLogger = async (req, res, next) => {
  // Only log mutating methods
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    // We attach an event listener to the response to log after it finishes
    res.on("finish", async () => {
      // If it's an admin user
      if (req.user && ["super_admin", "admin", "officer", "reviewer"].includes(req.user.role)) {
        // Many controllers already log manually, but this acts as a fallback for ones that don't
        // To avoid duplicate spam, we could check if a log was already written, or just log HTTP generic events
        await logActivity(
          req.user.id,
          `${req.method}_${req.originalUrl}`,
          "api_route",
          null,
          `Status: ${res.statusCode}`,
          req
        );
      }
    });
  }
  next();
};

module.exports = auditLogger;
