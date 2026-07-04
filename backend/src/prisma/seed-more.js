const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting supplementary massive database seed...");

  const admin = await prisma.admin.findFirst({ where: { adminId: "ADM001" } });
  if (!admin) throw new Error("Admin not found. Run seed.js first.");

  // Generate 45 realistic-sounding Services
  const moreServices = [];
  const serviceCategories = ["Health", "Transport", "Identity Services", "Taxation", "Education"];
  for (let i = 0; i < 45; i++) {
    moreServices.push({
      serviceCode: `SRV-X-${i + 1}`,
      name: `Government Service Provision ${i + 1}`,
      description: `Comprehensive digital service provision ${i + 1} for public welfare, tracking, and certification processing.`,
      category: serviceCategories[i % serviceCategories.length],
      department: "Ministry of Electronics and IT",
      requiredDocuments: "Aadhaar Card, Passport Photo, Address Proof",
      processingTime: "5-10 days",
      fees: Math.floor(Math.random() * 500) + 10,
      officialWebsite: `https://www.india.gov.in/service-${i + 1}`,
      createdById: admin.id,
    });
  }

  // Generate 45 realistic-sounding Schemes
  const moreSchemes = [];
  const schemeCategories = ["Agriculture", "Women & Child Welfare", "Pension", "Employment", "Housing"];
  for (let i = 0; i < 45; i++) {
    moreSchemes.push({
      schemeCode: `SCH-X-${i + 1}`,
      name: `National Welfare Initiative ${i + 1}`,
      description: `A new initiative ${i + 1} launched by the central government to promote digital literacy, financial inclusion, and social security.`,
      category: schemeCategories[i % schemeCategories.length],
      eligibility: "All citizens above 18 years of age.",
      benefits: `Direct benefit transfer of ₹${(i + 1) * 1000} and free health insurance coverage.`,
      state: "Central",
      department: "Ministry of Social Justice",
      applicationFee: 0,
      officialWebsite: `https://www.india.gov.in/scheme-${i + 1}`,
      createdById: admin.id,
    });
  }

  // Generate 10 realistic News updates
  const moreNews = [];
  for (let i = 0; i < 10; i++) {
    moreNews.push({
      title: `Government Announces Major Policy Update ${i + 1}`,
      content: `The central government has rolled out a major update regarding digital infrastructure and welfare programs. This update ${i + 1} aims to streamline processes, improve transparency, and benefit millions of citizens across the country with immediate effect.`,
      category: "Public Update",
      imageUrl: `https://picsum.photos/seed/newsupdate${i}/800/400`,
      isActive: true,
      publishedAt: new Date(Date.now() - (i * 86400000)), // past 'i' days
    });
  }

  // Insert to DB
  await prisma.service.createMany({ data: moreServices, skipDuplicates: true });
  console.log(`✅ Created ${moreServices.length} additional services`);

  await prisma.scheme.createMany({ data: moreSchemes, skipDuplicates: true });
  console.log(`✅ Created ${moreSchemes.length} additional schemes`);

  await prisma.news.deleteMany(); // Reset old news if any
  await prisma.news.createMany({ data: moreNews, skipDuplicates: true });
  console.log(`✅ Created ${moreNews.length} news articles`);

  console.log("🎉 Supplementary seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
