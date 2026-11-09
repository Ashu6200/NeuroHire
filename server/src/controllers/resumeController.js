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

  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 0, // Manual positioning from canvasState
    info: {
      Title: resume.title,
      Author: req.user.name || 'NeuroHire User',
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${resume.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`);
  doc.pipe(res);

  // canvasState is an array of blocks
  const blocks = resume.canvasState || [];

  // Sort blocks by Y position then X to have some order, though we use absolute positioning
  blocks.forEach((block) => {
    try {
      const { type, x, y, width, height, fill, stroke, strokeWidth, opacity, rotation } = block;
      
      doc.save();
      if (opacity !== undefined) doc.opacity(opacity);
      if (rotation) doc.rotate(rotation, { origin: [x, y] });

      if (type === 'text') {
        const { content, fontSize, fontFamily, fontStyle, color, align } = block;
        
        // Map common fonts to PDF standard fonts if possible
        let pdfFont = 'Helvetica';
        if (fontFamily === 'Times New Roman' || fontFamily === 'Georgia') pdfFont = 'Times-Roman';
        if (fontFamily === 'Courier New') pdfFont = 'Courier';
        
        if (fontStyle === 'bold') pdfFont += '-Bold';
        else if (fontStyle === 'italic') pdfFont += '-Oblique';

        doc.fillColor(color || '#000000')
           .font(pdfFont)
           .fontSize(fontSize || 12)
           .text(content || '', x, y, {
             width: width,
             align: align || 'left',
             lineGap: 2
           });
      } else if (type === 'rect' || type === 'rect-round') {
        const cornerRadius = block.cornerRadius || 0;
        if (cornerRadius > 0) {
          doc.roundedRect(x, y, width, height, cornerRadius);
        } else {
          doc.rect(x, y, width, height);
        }

        if (fill && fill !== 'transparent') {
          doc.fillColor(fill).fill();
        }
        if (stroke && stroke !== 'transparent') {
          doc.lineWidth(strokeWidth || 1).strokeColor(stroke).stroke();
        }
      } else if (type === 'line' || type === 'arrow') {
        const points = block.points || [];
        if (points.length >= 4) {
          doc.moveTo(x + points[0], y + points[1]);
          for (let i = 2; i < points.length; i += 2) {
            doc.lineTo(x + points[i], y + points[i+1]);
          }
          doc.lineWidth(strokeWidth || 1).strokeColor(stroke || fill || '#000000').stroke();
        }
      } else if (type === 'circle') {
        const radius = block.radius || (width / 2);
        doc.circle(x, y, radius);
        if (fill && fill !== 'transparent') doc.fillColor(fill).fill();
        if (stroke && stroke !== 'transparent') doc.lineWidth(strokeWidth || 1).strokeColor(stroke).stroke();
      }

      doc.restore();
    } catch (err) {
      console.error('Error rendering block to PDF:', err);
    }
  });

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
