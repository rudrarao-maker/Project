const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateReceiptPDF } = require('../utils/pdfGenerator');

exports.getReceipt = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    // Fetch the application and payment
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: {
        service: true,
        user: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const payment = application.payments[0];
    
    // We can also generate a receipt if application is approved, even if payment is not explicitly there, 
    // but for this implementation we assume payment must exist
    if (!payment || payment.status !== 'success' && application.status !== 'payment_completed' && application.status !== 'approved') {
       return res.status(400).json({ success: false, message: 'Payment not completed for this application' });
    }

    // Use fallback payment data if missing
    const paymentData = payment || {
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: application.updatedAt,
      status: 'success',
      amount: application.service?.fees || 0,
      method: 'Online'
    };

    const pdfBuffer = await generateReceiptPDF(paymentData, application, application.user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${application.applicationNumber}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    next(error);
  }
};
