const { PrismaClient } = require("@prisma/client");

/**
 * Generate a sequential ID in the format PREFIX + zero-padded number
 * e.g., USR001, ADM001, APP2024000001
 */
async function generateUserId(prisma) {
  const lastUser = await prisma.user.findFirst({
    orderBy: { id: "desc" },
    select: { userId: true },
  });

  if (!lastUser) return "USR001";

  const num = parseInt(lastUser.userId.replace("USR", ""), 10) + 1;
  return `USR${String(num).padStart(3, "0")}`;
}

async function generateAdminId(prisma) {
  const lastAdmin = await prisma.admin.findFirst({
    orderBy: { id: "desc" },
    select: { adminId: true },
  });

  if (!lastAdmin) return "ADM001";

  const num = parseInt(lastAdmin.adminId.replace("ADM", ""), 10) + 1;
  return `ADM${String(num).padStart(3, "0")}`;
}

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `APP${year}${random}`;
}

function generateGrievanceNumber() {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `GRV${year}${random}`;
}

function generateAppointmentNumber() {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `APT${year}${random}`;
}

function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

function generateTransactionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

module.exports = {
  generateUserId,
  generateAdminId,
  generateApplicationNumber,
  generateGrievanceNumber,
  generateAppointmentNumber,
  generateOTP,
  generateTransactionId,
};
