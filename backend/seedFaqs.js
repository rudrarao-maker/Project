const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faqs = [
  {
    question: 'How do I track my application status?',
    answer: 'You can track your application status by navigating to your Dashboard and looking at the "Recent Applications" table. The status will update in real-time as officials review your documents.',
    category: 'Applications'
  },
  {
    question: 'What documents are required for the Income Certificate?',
    answer: 'Typically, you need your Aadhaar Card, PAN Card, Salary Slips (last 3 months), and a recent passport size photograph. Requirements may vary slightly by state.',
    category: 'Documents'
  },
  {
    question: 'My payment failed, but money was deducted. What should I do?',
    answer: 'Do not panic. If the money was deducted but the application status did not update to "Payment Completed", the transaction will automatically be refunded to your original payment method within 5-7 business days.',
    category: 'Payments'
  },
  {
    question: 'How do I download the payment receipt?',
    answer: 'Once your payment is successful or your application is approved, a "Download Receipt" button will appear next to the application on your Dashboard.',
    category: 'Payments'
  },
  {
    question: 'How long does it take for document verification?',
    answer: 'Document verification usually takes between 3 to 5 business days, depending on the volume of applications and the specific department handling the service.',
    category: 'Applications'
  },
  {
    question: 'Can I apply for multiple schemes at the same time?',
    answer: 'Yes! You can apply for multiple schemes simultaneously. You can track all of them separately on your Dashboard.',
    category: 'General'
  }
];

async function main() {
  console.log('Seeding FAQs...');
  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq
    });
  }
  console.log('Successfully seeded FAQs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
