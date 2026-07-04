const { PrismaClient } = require("@prisma/client");
const ApiResponse = require("../utils/apiResponse");

const prisma = new PrismaClient();

/**
 * GET /api/search?q=...  — Global search across services, schemes, jobs, FAQs
 */
const globalSearch = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return ApiResponse.error(
        res,
        "Search query must be at least 2 characters",
        400,
      );
    }

    const searchTerm = q.trim();
    const take = Math.min(parseInt(limit), 10);

    const [services, schemes, jobs, faqs] = await Promise.all([
      prisma.service.findMany({
        where: {
          status: "active",
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { category: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          category: true,
          department: true,
          description: true,
        },
        take,
      }),
      prisma.scheme.findMany({
        where: {
          status: "active",
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { category: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          category: true,
          state: true,
          description: true,
        },
        take,
      }),
      prisma.job.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { department: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          department: true,
          state: true,
          deadline: true,
        },
        take,
      }),
      prisma.fAQ.findMany({
        where: {
          isActive: true,
          OR: [
            { question: { contains: searchTerm, mode: "insensitive" } },
            { answer: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: { id: true, question: true, category: true },
        take,
      }),
    ]);

    const totalResults =
      services.length + schemes.length + jobs.length + faqs.length;

    return ApiResponse.success(res, "Search results", {
      query: searchTerm,
      totalResults,
      services,
      schemes,
      jobs,
      faqs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/search/suggest?q=...  — Autocomplete suggestions
 */
const searchSuggest = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return ApiResponse.success(res, "Suggestions", { suggestions: [] });
    }

    const searchTerm = q.trim();

    const [services, schemes, jobs] = await Promise.all([
      prisma.service.findMany({
        where: {
          status: "active",
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: { name: true },
        take: 3,
      }),
      prisma.scheme.findMany({
        where: {
          status: "active",
          name: { contains: searchTerm, mode: "insensitive" },
        },
        select: { name: true },
        take: 3,
      }),
      prisma.job.findMany({
        where: {
          isActive: true,
          title: { contains: searchTerm, mode: "insensitive" },
        },
        select: { title: true },
        take: 3,
      }),
    ]);

    const suggestions = [
      ...services.map((s) => ({ text: s.name, type: "service" })),
      ...schemes.map((s) => ({ text: s.name, type: "scheme" })),
      ...jobs.map((j) => ({ text: j.title, type: "job" })),
    ];

    return ApiResponse.success(res, "Suggestions", { suggestions });
  } catch (error) {
    next(error);
  }
};

module.exports = { globalSearch, searchSuggest };
