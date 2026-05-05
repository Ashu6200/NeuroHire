const { asyncHandler } = require('../middlewares');
const mongoose = require('mongoose');
const { apiResponse, BaseError } = require('../utils');
const { ResumeModel } = require('../models');
const { USAGE_METRICS, PLAN_CODES } = require('../constants/plans');
const { consumeUsage } = require('../services/subscriptionService');

const MAX_STORED = {
  [PLAN_CODES.FREE]: 3,
  [PLAN_CODES.PRO]: 20,
  [PLAN_CODES.MAX]: Infinity,
};

const createResume = asyncHandler(async (req, res) => {
  const { title, canvasState, thumbnail, templateCategory, tags } = req.body;

  if (!canvasState) throw new BaseError('canvasState is required', 400);

  const plan = req.user.plan || PLAN_CODES.FREE;
  const maxStored = MAX_STORED[plan] ?? 3;
  if (maxStored !== Infinity) {
    const count = await ResumeModel.countDocuments({ userId: req.user.id, isDeleted: false });
    if (count >= maxStored) {
      throw new BaseError(
        `You can store up to ${maxStored} resumes on your current plan. Upgrade to store more.`,
        402,
      );
    }
  }

  const resume = await ResumeModel.create({
    userId: req.user.id,
    title: title || 'Untitled Resume',
    canvasState,
    thumbnail: thumbnail || null,
    templateCategory: templateCategory || 'other',
    tags: tags || [],
  });

  return apiResponse(req, res, 201, 'Resume created successfully', { resume });
});

const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await ResumeModel.find({ userId: req.user.id, isDeleted: false })
    .select('-canvasState')
    .sort({ updatedAt: -1 });

  return apiResponse(req, res, 200, 'Resumes fetched successfully', { resumes });
});

const getResumeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found', 404);
  if (resume.userId.toString() !== req.user.id && resume.visibility !== 'public') {
    throw new BaseError('Resume not found', 404);
  }

  return apiResponse(req, res, 200, 'Resume fetched successfully', { resume });
});

const updateResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, userId: req.user.id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found or not authorized', 404);

  const { title, canvasState, thumbnail, templateCategory, tags } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (canvasState !== undefined) updates.canvasState = canvasState;
  if (thumbnail !== undefined) updates.thumbnail = thumbnail;
  if (templateCategory !== undefined) updates.templateCategory = templateCategory;
  if (tags !== undefined) updates.tags = tags;

  const updated = await ResumeModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
  return apiResponse(req, res, 200, 'Resume updated successfully', { resume: updated });
});

const deleteResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, userId: req.user.id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found or not authorized', 404);

  await ResumeModel.findByIdAndUpdate(id, { $set: { isDeleted: true, visibility: 'private' } });
  return apiResponse(req, res, 200, 'Resume deleted successfully');
});

const publishResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, userId: req.user.id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found or not authorized', 404);

  const updated = await ResumeModel.findByIdAndUpdate(
    id,
    { $set: { visibility: 'public' } },
    { new: true },
  ).select('-canvasState');

  return apiResponse(req, res, 200, 'Resume published to templates', { resume: updated });
});

const unpublishResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, userId: req.user.id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found or not authorized', 404);

  const updated = await ResumeModel.findByIdAndUpdate(
    id,
    { $set: { visibility: 'private' } },
    { new: true },
  ).select('-canvasState');

  return apiResponse(req, res, 200, 'Resume set to private', { resume: updated });
});

const getPublicTemplates = asyncHandler(async (req, res) => {
  const { category, tag, page = 1, limit = 20 } = req.query;
  const filter = { visibility: 'public', isDeleted: false };
  if (category) filter.templateCategory = category;
  if (tag) filter.tags = tag;

  const skip = (Number(page) - 1) * Number(limit);
  const [templates, total] = await Promise.all([
    ResumeModel.find(filter)
      .select('-canvasState')
      .sort({ templateUsageCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ResumeModel.countDocuments(filter),
  ]);

  return apiResponse(req, res, 200, 'Templates fetched successfully', {
    templates,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

const useTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid template ID', 400);

  const template = await ResumeModel.findOne({ _id: id, visibility: 'public', isDeleted: false });
  if (!template) throw new BaseError('Template not found', 404);

  const plan = req.user.plan || PLAN_CODES.FREE;
  const maxStored = MAX_STORED[plan] ?? 3;
  if (maxStored !== Infinity) {
    const count = await ResumeModel.countDocuments({ userId: req.user.id, isDeleted: false });
    if (count >= maxStored) {
      throw new BaseError(
        `You can store up to ${maxStored} resumes on your current plan. Upgrade to store more.`,
        402,
      );
    }
  }

  const newResume = await ResumeModel.create({
    userId: req.user.id,
    title: `${template.title} (copy)`,
    canvasState: template.canvasState,
    thumbnail: template.thumbnail,
    templateCategory: template.templateCategory,
    tags: template.tags,
    visibility: 'private',
  });

  await ResumeModel.findByIdAndUpdate(id, { $inc: { templateUsageCount: 1 } });
  return apiResponse(req, res, 201, 'Template cloned to your resumes', { resume: newResume });
});

const exportResumePdf = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new BaseError('Invalid resume ID', 400);

  const resume = await ResumeModel.findOne({ _id: id, isDeleted: false });
  if (!resume) throw new BaseError('Resume not found', 404);
  if (resume.userId.toString() !== req.user.id && resume.visibility !== 'public') {
    throw new BaseError('Resume not found', 404);
  }

  await consumeUsage(req.user, USAGE_METRICS.RESUME_EXPORTS);

  let PDFDocument;
  try {
    PDFDocument = require('pdfkit');
  } catch {
    throw new BaseError('PDF export not available. Please contact support.', 503);
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).font('Helvetica-Bold').text(resume.title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(11).font('Helvetica').text(
    'This resume was created with NeuroHire. Open in the Resume Builder to view the full visual layout.',
    { align: 'center' },
  );
  doc.moveDown(2);
  doc.fontSize(10).fillColor('#888').text(
    `Exported on ${new Date().toLocaleDateString('en-IN')} | NeuroHire Resume Builder`,
    { align: 'center' },
  );
  doc.end();
});

const resumeController = {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  publishResume,
  unpublishResume,
  getPublicTemplates,
  useTemplate,
  exportResumePdf,
};

module.exports = resumeController;
