const { PrismaClient } = require('@prisma/client');
const path = require('path');
const ApiResponse = require('../utils/apiResponse');

const prisma = new PrismaClient();

/** POST /api/documents/upload */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'Please select a file to upload', 400);

    const { documentType, applicationId } = req.body;
    if (!documentType) return ApiResponse.error(res, 'Document type is required', 400);

    // Verify application belongs to user if provided
    if (applicationId) {
      const app = await prisma.application.findFirst({
        where: { id: parseInt(applicationId), userId: req.user.id },
      });
      if (!app) return ApiResponse.error(res, 'Invalid application', 400);
    }

    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        applicationId: applicationId ? parseInt(applicationId) : null,
        documentType,
        documentName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        status: 'pending',
      },
    });

    return ApiResponse.success(res, 'Document uploaded successfully', {
      documentId: document.id,
      fileName: document.documentName,
      fileSize: document.fileSize,
    }, 201);
  } catch (error) { next(error); }
};

/** GET /api/documents */
const getMyDocuments = async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' },
      include: {
        application: { select: { applicationNumber: true, service: { select: { name: true } } } },
      },
    });
    return ApiResponse.success(res, 'Documents retrieved', { documents });
  } catch (error) { next(error); }
};

/** GET /api/documents/:id */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: {
        reviewedBy: { select: { name: true } },
      },
    });
    if (!document) return ApiResponse.error(res, 'Document not found', 404);
    return ApiResponse.success(res, 'Document retrieved', { document });
  } catch (error) { next(error); }
};

/** GET /api/documents/:id/download */
const downloadDocument = async (req, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });
    if (!document) return ApiResponse.error(res, 'Document not found', 404);

    const filePath = path.resolve(document.filePath);
    res.download(filePath, document.documentName);
  } catch (error) { next(error); }
};

module.exports = { uploadDocument, getMyDocuments, getDocumentById, downloadDocument };
