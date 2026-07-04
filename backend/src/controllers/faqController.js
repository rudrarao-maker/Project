const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllFAQs = async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = { isActive: true };

    if (search) {
      filter = {
        ...filter,
        OR: [
          { question: { contains: search, mode: "insensitive" } },
          { answer: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const faqs = await prisma.fAQ.findMany({
      where: filter,
      orderBy: { category: "asc" },
    });

    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

exports.createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, isActive } = req.body;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};
