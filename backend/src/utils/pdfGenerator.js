const PDFDocument = require("pdfkit");
const path = require("path");

/**
 * Generate a payment receipt PDF
 * @param {Object} payment - Payment details
 * @param {Object} application - Application details
 * @param {Object} user - User details
 * @returns {Promise<Buffer>} - Resolves with PDF buffer
 */
exports.generateReceiptPDF = (payment, application, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("GOV E-SERVICES PORTAL", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Official Payment Receipt", {
          align: "center",
          color: "#666666",
        });
      doc.moveDown(2);

      // Add a line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Transaction Details
      doc.fontSize(14).font("Helvetica-Bold").text("Transaction Details");
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Transaction ID: ${payment.transactionId}`);
      doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);
      doc.text(`Status: ${payment.status.toUpperCase()}`);
      doc.text(`Amount Paid: Rs. ${payment.amount}`);
      if (payment.method)
        doc.text(`Payment Method: ${payment.method.toUpperCase()}`);
      doc.moveDown();

      // Applicant Details
      doc.fontSize(14).font("Helvetica-Bold").text("Applicant Details");
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Name: ${user.name}`);
      doc.text(`Application No: ${application.applicationNumber}`);
      doc.text(
        `Service: ${application.service?.name || "Service Application"}`,
      );
      doc.moveDown();

      // Add a line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          "This is a computer generated document and does not require a signature.",
          { align: "center" },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a completion certificate PDF
 * @param {Object} application - Application details (with service)
 * @param {Object} user - User details
 * @returns {Promise<Buffer>}
 */
exports.generateCertificatePDF = (application, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        layout: "landscape",
      });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Border
      doc
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke("#000080");
      doc
        .rect(35, 35, doc.page.width - 70, doc.page.height - 70)
        .stroke("#FF9933");

      // Header
      doc.moveDown(3);
      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#000080")
        .text("GOV E-SERVICES PORTAL", { align: "center" });
      doc.moveDown(0.3);
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#666")
        .text("Government of India", { align: "center" });
      doc.moveDown(2);

      // Certificate Title
      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .fillColor("#138808")
        .text("CERTIFICATE OF COMPLETION", { align: "center" });
      doc.moveDown(2);

      // Body
      doc.fontSize(14).font("Helvetica").fillColor("#333");
      doc.text("This is to certify that", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#000080")
        .text(user.name, { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(14).font("Helvetica").fillColor("#333");
      doc.text(`has successfully completed the application process for`, {
        align: "center",
      });
      doc.moveDown(0.5);
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .fillColor("#000080")
        .text(application.service?.name || "Government Service", {
          align: "center",
        });
      doc.moveDown(1.5);

      // Details
      doc.fontSize(11).font("Helvetica").fillColor("#555");
      doc.text(`Application Number: ${application.applicationNumber}`, {
        align: "center",
      });
      doc.text(
        `Date of Approval: ${new Date(application.updatedAt).toLocaleDateString()}`,
        { align: "center" },
      );
      doc.moveDown(1);

      // Digital Seal
      doc
        .circle(doc.page.width / 2, doc.y + 40, 40)
        .lineWidth(3)
        .stroke("#138808");
      doc
        .circle(doc.page.width / 2, doc.y + 40, 35)
        .lineWidth(1)
        .stroke("#138808");
      doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor("#138808")
        .text("DIGITALLY\nVERIFIED", doc.page.width / 2 - 30, doc.y + 32, {
          width: 60,
          align: "center",
        });

      doc.moveDown(4);

      // Verification link
      const verifyUrl = `https://gov-eservices.in/verify/${application.applicationNumber}`;
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#0000FF")
        .text(`Verify Certificate at: ${verifyUrl}`, {
          align: "center",
          link: verifyUrl,
        });

      doc.moveDown(2);

      // Footer
      doc
        .moveTo(doc.page.width / 2 - 100, doc.y)
        .lineTo(doc.page.width / 2 + 100, doc.y)
        .stroke("#333");
      doc.moveDown(0.3);
      doc.fontSize(10).text("Authorized Signatory", { align: "center" });
      doc.moveDown(2);
      doc
        .fontSize(8)
        .fillColor("#999")
        .text(
          "This is a computer generated certificate and does not require a physical signature.",
          { align: "center" },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate an application summary PDF (for admin download)
 * @param {Object} application - Full application with user, service, documents
 * @returns {Promise<Buffer>}
 */
exports.generateApplicationSummaryPDF = (application) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("GOV E-SERVICES PORTAL", { align: "center" });
      doc.moveDown(0.3);
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Application Summary Report", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Application Info
      doc.fontSize(14).font("Helvetica-Bold").text("Application Information");
      doc.moveDown(0.5);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Application Number: ${application.applicationNumber}`);
      doc.text(`Status: ${application.status.toUpperCase().replace("_", " ")}`);
      doc.text(`Priority: ${application.priority.toUpperCase()}`);
      doc.text(
        `Submitted On: ${new Date(application.createdAt).toLocaleString()}`,
      );
      doc.text(
        `Last Updated: ${new Date(application.updatedAt).toLocaleString()}`,
      );
      if (application.remarks) doc.text(`Remarks: ${application.remarks}`);
      doc.moveDown();

      // Service Info
      if (application.service) {
        doc.fontSize(14).font("Helvetica-Bold").text("Service Details");
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica");
        doc.text(`Service Name: ${application.service.name}`);
        if (application.service.category)
          doc.text(`Category: ${application.service.category}`);
        if (application.service.department)
          doc.text(`Department: ${application.service.department}`);
        if (application.service.fees)
          doc.text(`Fees: Rs. ${application.service.fees}`);
        doc.moveDown();
      }

      // Applicant Info
      if (application.user) {
        doc.fontSize(14).font("Helvetica-Bold").text("Applicant Details");
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica");
        doc.text(`Name: ${application.user.name}`);
        doc.text(`Email: ${application.user.email}`);
        if (application.user.mobile)
          doc.text(`Mobile: ${application.user.mobile}`);
        if (application.user.aadhaarNumber)
          doc.text(
            `Aadhaar: XXXX-XXXX-${application.user.aadhaarNumber.slice(-4)}`,
          );
        doc.moveDown();
      }

      // Documents
      if (application.documents && application.documents.length > 0) {
        doc.fontSize(14).font("Helvetica-Bold").text("Uploaded Documents");
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica");
        application.documents.forEach((docItem, i) => {
          doc.text(
            `${i + 1}. ${docItem.documentType} — ${docItem.status.toUpperCase()} (${docItem.documentName})`,
          );
        });
        doc.moveDown();
      }

      // Footer
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc
        .fontSize(8)
        .font("Helvetica-Oblique")
        .text(`Generated on: ${new Date().toLocaleString()}`, {
          align: "center",
        });
      doc.text("This is a computer generated document.", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
