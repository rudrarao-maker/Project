const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

const generateDigitalSignature = (documentId, userId) => {
  const secret = process.env.JWT_SECRET || "default-secret";
  const data = `${documentId}-${userId}-${Date.now()}`;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};

const appendQRAndSignatureToPDF = async (filePath, documentId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!filePath.endsWith(".pdf")) {
        return resolve(false); // Only process PDFs
      }

      const signature = generateDigitalSignature(documentId, userId);
      const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?doc=${documentId}&sig=${signature}`;
      
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl);
      
      const certPath = filePath.replace(".pdf", "-verified.pdf");
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(certPath);
      doc.pipe(writeStream);
      
      doc.fontSize(20).text("Document Verification Certificate", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Document ID: ${documentId}`);
      doc.text(`Verified For User ID: ${userId}`);
      doc.text(`Digital Signature: ${signature}`);
      doc.text(`Verification Time: ${new Date().toISOString()}`);
      doc.moveDown();
      doc.text("Scan QR to Verify Online:", { underline: true });
      doc.image(qrImageBuffer, { fit: [150, 150], align: "center" });
      
      doc.end();
      
      writeStream.on("finish", () => {
        resolve({ certPath, signature });
      });
      writeStream.on("error", reject);

    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateDigitalSignature, appendQRAndSignatureToPDF };
