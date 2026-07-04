const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getJobs = async (req, res, next) => {
  try {
    const { category, state, search, limit } = req.query;

    const where = {
      isActive: true,
    };

    if (category) where.category = category;
    if (state) where.state = state;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { deadline: "asc" },
      take: limit ? parseInt(limit) : undefined,
    });

    res.status(200).json({
      status: "success",
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
    });

    if (!job) {
      return res.status(404).json({ status: "fail", message: "Job not found" });
    }

    res.status(200).json({
      status: "success",
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};
