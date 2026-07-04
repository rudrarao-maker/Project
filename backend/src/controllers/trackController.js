const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/**
 * GET /api/track/:applicationNumber — Public (no auth)
 */
const trackApplication = async (req, res, next) => {
  try {
    const { applicationNumber } = req.params;

    if (!applicationNumber) {
      return ApiResponse.error(res, "Application number is required", 400);
    }

    const application = await prisma.application.findUnique({
      where: { applicationNumber },
      include: {
        service: {
          select: {
            name: true,
            category: true,
            department: true,
            processingTime: true,
          },
        },
      },
    });

    if (!application || application.deletedAt) {
      return ApiResponse.error(
        res,
        "Application not found. Please check the application number.",
        404,
      );
    }

    // Build timeline from status
    const statusStages = [
      {
        key: "pending",
        label: "Application Submitted",
        description: "Your application has been received",
      },
      {
        key: "document_verification",
        label: "Document Verification",
        description: "Your documents are being verified",
      },
      {
        key: "in_progress",
        label: "Under Review",
        description: "Your application is being reviewed by an officer",
      },
      {
        key: "payment_pending",
        label: "Payment Pending",
        description: "Payment is required to proceed",
      },
      {
        key: "payment_completed",
        label: "Payment Completed",
        description: "Payment has been received",
      },
      {
        key: "approved",
        label: "Approved",
        description: "Your application has been approved",
      },
      {
        key: "rejected",
        label: "Rejected",
        description: "Your application has been rejected",
      },
      {
        key: "completed",
        label: "Completed",
        description: "Application process is complete",
      },
    ];

    const currentStatusIndex = statusStages.findIndex(
      (s) => s.key === application.status,
    );

    // Build timeline with completion status
    const timeline = statusStages
      .filter(
        (s) =>
          !["rejected", "completed"].includes(s.key) ||
          s.key === application.status,
      )
      .map((stage, index) => ({
        ...stage,
        completed: index <= currentStatusIndex,
        current: stage.key === application.status,
        timestamp:
          stage.key === "pending"
            ? application.createdAt
            : stage.key === application.status
              ? application.updatedAt
              : null,
      }));

    return ApiResponse.success(res, "Application tracked successfully", {
      applicationNumber: application.applicationNumber,
      status: application.status,
      serviceName: application.service?.name || "Government Service",
      department: application.service?.department,
      category: application.service?.category,
      processingTime: application.service?.processingTime,
      submittedAt: application.createdAt,
      lastUpdated: application.updatedAt,
      remarks: application.remarks,
      priority: application.priority,
      timeline,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { trackApplication };
