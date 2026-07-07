const { PrismaClient } = require("@prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

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

const askAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const session = await getSession(req.user.id);

    // Save user message
    await saveMessage(session.id, "user", req.user.id, message);

    let assistantReply = "I am a helpful citizen assistant.";
    
    if (config.gemini.apiKey) {
      const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a helpful government citizen assistant for the Government e-Services Portal. 
      Help the citizen with their query: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      assistantReply = response.text();
    } else {
      assistantReply = "The AI assistant is currently unavailable as the API key is missing. Please contact support.";
    }

    // Save admin/assistant message
    const botMsg = await saveMessage(session.id, "admin", null, assistantReply);

    res.json({ success: true, data: botMsg });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSession, saveMessage, getMessageHistory, askAssistant };
