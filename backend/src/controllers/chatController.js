const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSession = async (userId) => {
  // Find active session for user
  let session = await prisma.chatSession.findFirst({
    where: { userId, isActive: true },
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        sessionId: `CHAT${Date.now()}`,
        userId,
        isActive: true,
      },
    });
  }

  return session;
};

const saveMessage = async (sessionId, senderType, senderId, content) => {
  return await prisma.chatMessage.create({
    data: {
      sessionId,
      senderType, // 'user' or 'admin'
      senderUserId: senderType === "user" ? senderId : null,
      senderAdminId: senderType === "admin" ? senderId : null,
      content,
    },
  });
};

const getMessageHistory = async (req, res, next) => {
  try {
    const session = await getSession(req.user.id);
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSession, saveMessage, getMessageHistory };
