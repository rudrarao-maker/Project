const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
];

const CATEGORIES = [
  "Identity Services",
  "Education",
  "Health",
  "Agriculture",
  "Women & Child Welfare",
  "Pension",
  "Employment",
  "Taxation",
  "Business Registration",
  "Police Services",
  "Certificates",
  "Transport",
  "Land Records",
  "Electricity",
  "Water",
  "Housing",
  "Banking",
  "Digital Services",
  "Public Distribution System",
  "Passport Services",
];

async function main() {
  console.log("🌱 Starting massive database seed...");

  // Hash password (all sample accounts use "password")
  const hashedPassword = await bcrypt.hash("password", 12);

  // ============================================================================
  // ADMINS & USERS
  // ============================================================================
  console.log("👤 Creating admins...");
  const admin = await prisma.admin.upsert({
    where: { adminId: "ADM001" },
    update: {},
    create: {
      adminId: "ADM001",
      name: "Super Admin",
      email: "superadmin@gov.in",
      mobile: "9999999999",
      password: hashedPassword,
      role: "super_admin",
      department: "IT Department",
      designation: "System Administrator",
      status: "active",
    },
  });

  console.log("👥 Creating users...");
  const user = await prisma.user.upsert({
    where: { userId: "USR001" },
    update: {},
    create: {
      userId: "USR001",
      name: "Test User",
      email: "test@example.com",
      mobile: "9876543210",
      aadhaarNumber: "123456789012",
      password: hashedPassword,
      status: "active",
      emailVerified: true,
      mobileVerified: true,
    },
  });

  // ============================================================================
  // REALISTIC SERVICES
  // ============================================================================
  console.log("🏛️ Creating realistic services...");
  const REALISTIC_SERVICES = [
    {
      name: "Aadhaar Card Update & Enrollment",
      description:
        "Apply for a new Aadhaar card, update your address, phone number, or biometric details online.",
      category: "Identity Services",
      department: "UIDAI",
      requiredDocuments: "Identity Proof, Address Proof",
      processingTime: "7-14 days",
      fees: 50,
      state: "Central",
      officialWebsite: "https://myaadhaar.uidai.gov.in/",
    },
    {
      name: "Passport Application (New/Renewal)",
      description:
        "Apply for a fresh passport or renew your existing passport through the Passport Seva Kendra.",
      category: "Passport Services",
      department: "Ministry of External Affairs",
      requiredDocuments: "Aadhaar, Birth Certificate, Address Proof",
      processingTime: "15-30 days",
      fees: 1500,
      state: "Central",
      officialWebsite: "https://www.passportindia.gov.in/",
    },
    {
      name: "Permanent Account Number (PAN) Card",
      description:
        "Apply for a new PAN card or make corrections in PAN card details for income tax purposes.",
      category: "Taxation",
      department: "Income Tax Department",
      requiredDocuments: "Aadhaar Card, Passport Photo",
      processingTime: "10-15 days",
      fees: 107,
      state: "Central",
      officialWebsite:
        "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    },
    {
      name: "Voter ID Registration",
      description:
        "Register as a new voter, update details, or track your Electoral Photo Identity Card (EPIC) status.",
      category: "Identity Services",
      department: "Election Commission of India",
      requiredDocuments: "Address Proof, Age Proof, Passport Photo",
      processingTime: "30-45 days",
      fees: 0,
      state: "Central",
      officialWebsite: "https://voters.eci.gov.in/",
    },
    {
      name: "Driving License (Learner/Permanent)",
      description:
        "Apply for a new Learner License or Permanent Driving License, or renew an expired license.",
      category: "Transport",
      department: "Ministry of Road Transport",
      requiredDocuments: "Aadhaar, Medical Certificate, Age Proof",
      processingTime: "7-15 days",
      fees: 200,
      state: "State",
      officialWebsite: "https://sarathi.parivahan.gov.in/",
    },
    {
      name: "Income Certificate",
      description:
        "Obtain an official certificate to prove your annual family income for welfare schemes and scholarships.",
      category: "Certificates",
      department: "Revenue Department",
      requiredDocuments: "Salary Slips, IT Return, Aadhaar",
      processingTime: "15 days",
      fees: 20,
      state: "State",
      officialWebsite: "https://edistrict.delhigovt.nic.in/",
    },
    {
      name: "Birth & Death Registration",
      description:
        "Register a new birth or death and obtain the official certificate from the municipal corporation.",
      category: "Certificates",
      department: "Municipal Corporation",
      requiredDocuments: "Hospital Discharge Summary, ID Proof",
      processingTime: "7-10 days",
      fees: 10,
      state: "State",
      officialWebsite: "https://crsorgi.gov.in/",
    },
    {
      name: "Vehicle Registration (RC)",
      description:
        "Register your new vehicle, transfer ownership, or obtain a duplicate Registration Certificate.",
      category: "Transport",
      department: "RTO Office",
      requiredDocuments: "Dealer Invoice, Insurance, PAN",
      processingTime: "15-20 days",
      fees: 600,
      state: "State",
      officialWebsite: "https://vahan.parivahan.gov.in/",
    },
    {
      name: "Caste Certificate",
      description:
        "Obtain SC/ST/OBC certificate for availing government reservations and benefits.",
      category: "Certificates",
      department: "Revenue Department",
      requiredDocuments: "Aadhaar, Family Tree, Income Proof",
      processingTime: "21 days",
      fees: 30,
      state: "State",
      officialWebsite: "https://services.india.gov.in/",
    },
    {
      name: "Domicile Certificate",
      description:
        "Apply for a resident/domicile certificate to prove continuous residency in a State.",
      category: "Certificates",
      department: "Revenue Department",
      requiredDocuments: "Aadhaar, Utility Bill, Education Records",
      processingTime: "15 days",
      fees: 25,
      state: "State",
      officialWebsite: "https://services.india.gov.in/",
    },
    {
      name: "EPFO Claim & Balance",
      description:
        "Check EPF balance, apply for PF withdrawal or advance, and manage your UAN.",
      category: "Employment",
      department: "Employees Provident Fund Organisation",
      requiredDocuments: "UAN, Aadhaar, Bank Details",
      processingTime: "3-7 days",
      fees: 0,
      state: "Central",
      officialWebsite:
        "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
    },
    {
      name: "GST Registration",
      description:
        "Register your business for Goods and Services Tax (GST) to comply with tax regulations.",
      category: "Business Registration",
      department: "CBIC",
      requiredDocuments: "PAN, Aadhaar, Business Proof",
      processingTime: "7 days",
      fees: 0,
      state: "Central",
      officialWebsite: "https://reg.gst.gov.in/registration/",
    },
    {
      name: "MSME Udyam Registration",
      description:
        "Register your micro, small, or medium enterprise to avail government benefits and subsidies.",
      category: "Business Registration",
      department: "Ministry of MSME",
      requiredDocuments: "Aadhaar, PAN, Bank Account",
      processingTime: "1 day",
      fees: 0,
      state: "Central",
      officialWebsite: "https://udyamregistration.gov.in/",
    },
    {
      name: "Ration Card Application",
      description:
        "Apply for a new ration card or add/remove members from an existing card.",
      category: "Public Distribution System",
      department: "Food and Civil Supplies",
      requiredDocuments: "Aadhaar, Income Proof, Address Proof",
      processingTime: "30 days",
      fees: 10,
      state: "State",
      officialWebsite: "https://nfsa.gov.in/",
    },
    {
      name: "Police Clearance Certificate (PCC)",
      description:
        "Apply for a PCC for employment, visa, or immigration purposes.",
      category: "Police Services",
      department: "State Police / MEA",
      requiredDocuments: "Aadhaar, Passport, Address Proof",
      processingTime: "15-21 days",
      fees: 500,
      state: "Central",
      officialWebsite: "https://www.passportindia.gov.in/",
    },
  ];

  const servicesData = REALISTIC_SERVICES.map((svc, idx) => ({
    serviceCode: `SRV${String(idx + 1).padStart(4, "0")}`,
    name: svc.name,
    description: svc.description,
    category: svc.category,
    department: svc.department,
    requiredDocuments: svc.requiredDocuments,
    processingTime: svc.processingTime,
    fees: svc.fees,
    officialWebsite: svc.officialWebsite,
    createdById: admin.id,
  }));

  // Insert Services
  await prisma.service.deleteMany(); // Reset
  await prisma.service.createMany({ data: servicesData, skipDuplicates: true });
  console.log(`  ✅ Created ${servicesData.length} realistic services`);

  // ============================================================================
  // REALISTIC SCHEMES
  // ============================================================================
  console.log("📋 Creating realistic schemes...");
  const REALISTIC_SCHEMES = [
    {
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description:
        "Provides income support of ₹6,000 per year to all landholding farmer families.",
      category: "Agriculture",
      eligibility: "All landholding farmers families.",
      benefits: "₹6000 per year in 3 equal installments.",
      state: "Central",
      department: "Ministry of Agriculture",
      officialWebsite: "https://pmkisan.gov.in/",
    },
    {
      name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
      description:
        "Provides health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
      category: "Health",
      eligibility: "Vulnerable families identified by SECC database.",
      benefits: "Health insurance cover up to ₹5,000,000.",
      state: "Central",
      department: "Ministry of Health and Family Welfare",
      officialWebsite: "https://nha.gov.in/PM-JAY",
    },
    {
      name: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
      description:
        "Enhances livelihood security in rural areas by providing at least 100 days of wage employment.",
      category: "Employment",
      eligibility: "Adult members of a rural household.",
      benefits: "100 days of guaranteed wage employment.",
      state: "Central",
      department: "Ministry of Rural Development",
      officialWebsite: "https://nrega.nic.in/",
    },
    {
      name: "Pradhan Mantri Awas Yojana (PMAY-U)",
      description:
        "Housing for All in Urban areas by providing affordable houses with water, sanitation, and electricity.",
      category: "Housing",
      eligibility: "EWS/LIG households in urban areas.",
      benefits: "Affordable housing and credit linked subsidy.",
      state: "Central",
      department: "Ministry of Housing and Urban Affairs",
      officialWebsite: "https://pmay-urban.gov.in/",
    },
    {
      name: "Sukanya Samriddhi Yojana (SSY)",
      description:
        "Small deposit scheme for the girl child launched as a part of the Beti Bachao Beti Padhao campaign.",
      category: "Women & Child Welfare",
      eligibility:
        "Parents or legal guardians of a girl child up to 10 years of age.",
      benefits: "High interest rate and tax benefits.",
      state: "Central",
      department: "Ministry of Finance",
      officialWebsite:
        "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
    },
    {
      name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      description:
        "National Mission for Financial Inclusion to ensure access to financial services in an affordable manner.",
      category: "Banking",
      eligibility:
        "Any Indian citizen above 10 years of age without a bank account.",
      benefits: "Zero balance account, accidental insurance cover.",
      state: "Central",
      department: "Ministry of Finance",
      officialWebsite: "https://pmjdy.gov.in/",
    },
    {
      name: "Atal Pension Yojana (APY)",
      description: "Pension scheme targeted at the unorganized sector workers.",
      category: "Pension",
      eligibility: "Indian citizens between 18 and 40 years of age.",
      benefits: "Guaranteed minimum pension of ₹1,000 to ₹5,000 per month.",
      state: "Central",
      department: "Ministry of Finance",
      officialWebsite: "https://npscra.nsdl.co.in/scheme-details.php",
    },
    {
      name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      description: "Provides LPG connections to women from BPL households.",
      category: "Social Welfare",
      eligibility: "Women belonging to BPL families.",
      benefits: "Financial support of ₹1600 for each LPG connection.",
      state: "Central",
      department: "Ministry of Petroleum and Natural Gas",
      officialWebsite: "https://www.pmuy.gov.in/",
    },
    {
      name: "PM Vishwakarma Yojana",
      description:
        "Support traditional artisans and craftspeople in rural and urban areas.",
      category: "Skill Development",
      eligibility: "Artisans engaged in 18 specified traditional trades.",
      benefits: "Collateral free credit support up to ₹3 lakh.",
      state: "Central",
      department: "Ministry of MSME",
      officialWebsite: "https://pmvishwakarma.gov.in/",
    },
    {
      name: "Beti Bachao Beti Padhao",
      description:
        "Campaign to generate awareness and improve the efficiency of welfare services for girls.",
      category: "Women & Child Welfare",
      eligibility: "Girl children and their parents.",
      benefits: "Awareness and focused interventions for the girl child.",
      state: "Central",
      department: "Ministry of Women and Child Development",
      officialWebsite: "https://wcd.nic.in/bbbp-schemes",
    },
    {
      name: "National Social Assistance Programme (NSAP)",
      description:
        "Welfare program providing support to aged persons, widows, and disabled persons.",
      category: "Pension",
      eligibility: "BPL persons who are aged 60+, widows, or disabled.",
      benefits: "Monthly pension of ₹200 to ₹500.",
      state: "Central",
      department: "Ministry of Rural Development",
      officialWebsite: "https://nsap.nic.in/",
    },
    {
      name: "Stand Up India Scheme",
      description:
        "Facilitates bank loans for setting up greenfield enterprises.",
      category: "Business Registration",
      eligibility: "SC/ST and/or women entrepreneurs.",
      benefits: "Bank loans between ₹10 lakh and ₹1 crore.",
      state: "Central",
      department: "Ministry of Finance",
      officialWebsite: "https://www.standupmitra.in/",
    },
  ];

  const schemesData = REALISTIC_SCHEMES.map((scheme, idx) => ({
    schemeCode: `SCH${String(idx + 1).padStart(4, "0")}`,
    name: scheme.name,
    description: scheme.description,
    category: scheme.category,
    eligibility: scheme.eligibility,
    benefits: scheme.benefits,
    state: scheme.state,
    department: scheme.department,
    applicationFee: 0,
    officialWebsite: scheme.officialWebsite,
    createdById: admin.id,
  }));

  await prisma.scheme.deleteMany();
  await prisma.scheme.createMany({ data: schemesData, skipDuplicates: true });
  console.log(`  ✅ Created ${schemesData.length} realistic schemes`);

  // ============================================================================
  // REALISTIC JOBS
  // ============================================================================
  console.log("💼 Creating realistic jobs...");
  const REALISTIC_JOBS = [
    {
      title: "SSC CGL Recruitment 2024",
      department: "Staff Selection Commission",
      state: "Central",
      category: "Administrative",
      qualification: "Graduate",
      ageLimit: "18-32 Years",
      salary: "₹47,600 - ₹1,51,100",
      officialWebsite: "https://ssc.nic.in/",
    },
    {
      title: "UPSC Civil Services Examination",
      department: "Union Public Service Commission",
      state: "Central",
      category: "Civil Services",
      qualification: "Graduate",
      ageLimit: "21-32 Years",
      salary: "₹56,100 - ₹2,50,000",
      officialWebsite: "https://upsc.gov.in/",
    },
    {
      title: "IBPS PO Recruitment 2024",
      department: "Institute of Banking Personnel Selection",
      state: "Central",
      category: "Banking",
      qualification: "Graduate",
      ageLimit: "20-30 Years",
      salary: "₹36,000 - ₹63,840",
      officialWebsite: "https://www.ibps.in/",
    },
    {
      title: "Indian Railway Assistant Loco Pilot (RRB ALP)",
      department: "Ministry of Railways",
      state: "Central",
      category: "Railways",
      qualification: "Matriculation + ITI / Diploma",
      ageLimit: "18-30 Years",
      salary: "₹19,900 - ₹63,200",
      officialWebsite: "https://indianrailways.gov.in/",
    },
    {
      title: "State Police Constable Recruitment",
      department: "State Police Department",
      state: "State",
      category: "Defense / Police",
      qualification: "12th Pass",
      ageLimit: "18-25 Years",
      salary: "₹21,700 - ₹69,100",
      officialWebsite: "https://police.gov.in/",
    },
    {
      title: "Indian Army Agniveer Rally 2024",
      department: "Ministry of Defence",
      state: "Central",
      category: "Defense",
      qualification: "10th / 12th Pass",
      ageLimit: "17.5 - 21 Years",
      salary: "₹30,000 / month (1st year)",
      officialWebsite: "https://joinindianarmy.nic.in/",
    },
    {
      title: "SBI Clerk Recruitment 2024",
      department: "State Bank of India",
      state: "Central",
      category: "Banking",
      qualification: "Graduate",
      ageLimit: "20-28 Years",
      salary: "₹29,000 - ₹35,000",
      officialWebsite: "https://sbi.co.in/web/careers",
    },
    {
      title: "ISRO Scientist/Engineer Recruitment",
      department: "Indian Space Research Organisation",
      state: "Central",
      category: "Engineering",
      qualification: "B.E/B.Tech/M.Sc",
      ageLimit: "Up to 28 Years",
      salary: "₹56,100 - ₹1,77,500",
      officialWebsite: "https://www.isro.gov.in/Careers.html",
    },
    {
      title: "FCI Assistant Grade III",
      department: "Food Corporation of India",
      state: "Central",
      category: "Administrative",
      qualification: "Graduate",
      ageLimit: "18-27 Years",
      salary: "₹28,200 - ₹79,200",
      officialWebsite: "https://fci.gov.in/",
    },
    {
      title: "Indian Post GDS Recruitment",
      department: "Department of Posts",
      state: "Central",
      category: "Logistics",
      qualification: "10th Pass",
      ageLimit: "18-40 Years",
      salary: "₹10,000 - ₹24,470",
      officialWebsite: "https://indiapostgdsonline.gov.in/",
    },
  ];

  const jobsData = REALISTIC_JOBS.map((job, idx) => ({
    jobCode: `JOB${String(idx + 1).padStart(4, "0")}`,
    title: job.title,
    department: job.department,
    state: job.state,
    category: job.category,
    qualification: job.qualification,
    ageLimit: job.ageLimit,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
    salary: job.salary,
    jobType: "Full Time",
    description: `Recruitment drive for ${job.title}.`,
    officialWebsite: job.officialWebsite,
    notificationPdf: `/docs/notification.pdf`,
    isActive: true,
  }));

  await prisma.job.deleteMany();
  for (let i = 0; i < jobsData.length; i += 50) {
    await prisma.job.createMany({
      data: jobsData.slice(i, i + 50),
      skipDuplicates: true,
    });
  }
  console.log(`  ✅ Created ${jobsData.length} jobs`);

  // ============================================================================
  // SAMPLE APPLICATIONS & PAYMENTS
  // ============================================================================
  console.log("📝 Creating sample applications and payments...");
  await prisma.payment.deleteMany();
  await prisma.application.deleteMany();

  const createdServices = await prisma.service.findMany({ take: 5 });

  const appsData = createdServices.map((svc, idx) => ({
    userId: user.id,
    serviceId: svc.id,
    applicationNumber: `APP2024${String(idx + 1).padStart(5, "0")}`,
    status:
      idx === 0 ? "payment_completed" : idx === 1 ? "approved" : "pending",
    submittedData: { fullName: "Test User" },
    priority: "medium",
  }));

  for (const app of appsData) {
    const createdApp = await prisma.application.create({ data: app });

    // Create payment if applicable
    if (app.status === "payment_completed" || app.status === "approved") {
      await prisma.payment.create({
        data: {
          transactionId: `TXN${Date.now()}${createdApp.id}`,
          applicationId: createdApp.id,
          amount:
            createdServices.find((s) => s.id === createdApp.serviceId).fees ||
            100,
          status: "success",
          method: "upi",
          paymentDate: new Date(),
        },
      });
    }
  }

  console.log(`  ✅ Created sample applications`);

  console.log("\\n🎉 Massive database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
