const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { matchSkills } = require('../services/skillMatcherService');
const { emitNotificationToUser } = require('../socket/socketManager');
const { sendApplicationStatusEmail } = require('../services/emailService');
const { sendWhatsAppStatusNotification } = require('../services/whatsappService');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Student)
 */
const applyForJob = async (req, res, next) => {
  try {
    const { jobId, resumeUrl } = req.body;

    if (!jobId) {
      return errorResponse(res, 400, 'Job ID is required');
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.status !== 'active') {
      return errorResponse(res, 400, 'This job posting is no longer accepting applications');
    }

    // Check deadline
    if (new Date() > new Date(job.deadline)) {
      return errorResponse(res, 400, 'The application deadline for this job has passed');
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return errorResponse(res, 409, 'You have already applied for this job');
    }

    // Check eligibility
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return errorResponse(res, 400, 'Please complete your placement profile before applying');
    }

    // Check CGPA Eligibility
    if (job.minCGPA && studentProfile.cgpa < job.minCGPA) {
      return errorResponse(
        res,
        400,
        `Your CGPA (${studentProfile.cgpa}) does not meet the minimum requirement (${job.minCGPA}) for this job`
      );
    }

    // Check Department Eligibility
    if (
      job.eligibleDepartments &&
      job.eligibleDepartments.length > 0 &&
      !job.eligibleDepartments.includes(studentProfile.department)
    ) {
      return errorResponse(
        res,
        400,
        `Your department (${studentProfile.department}) is not eligible for this role`
      );
    }

    // Calculate Skill Match Score
    const skillMatchResult = matchSkills(studentProfile.skills, job.requiredSkills);

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      resumeUrl: resumeUrl || studentProfile.resumeUrl || '',
      matchScore: skillMatchResult.matchScore,
      matchedSkills: skillMatchResult.matchedSkills,
      missingSkills: skillMatchResult.missingSkills,
      status: 'Applied',
    });

    // 1. Send In-App & WebSockets Notification to Recruiter
    const notificationObj = await Notification.create({
      recipient: job.createdBy,
      sender: req.user.id,
      type: 'new_application',
      title: `New Candidate Applied - ${job.title}`,
      message: `${req.user.name} applied for "${job.title}" with a ${skillMatchResult.matchScore}% skill match score.`,
      relatedJob: job._id,
      relatedApplication: application._id,
    });

    try {
      emitNotificationToUser(job.createdBy.toString(), notificationObj);
    } catch (e) {
      // Non-blocking socket error
    }

    // 2. Dispatch Confirmation Email to Student
    try {
      const emailResult = await sendApplicationStatusEmail({
        studentName: req.user.name,
        studentEmail: req.user.email,
        jobTitle: job.title,
        companyName: job.company?.name || 'Partner Company',
        status: 'Applied',
        matchScore: skillMatchResult.matchScore,
      });

      const waResult = await sendWhatsAppStatusNotification({
        studentName: req.user.name,
        studentPhone: studentProfile.phone || '9876543210',
        jobTitle: job.title,
        companyName: job.company?.name || 'Partner Company',
        status: 'Applied',
        matchScore: skillMatchResult.matchScore,
      });

      // Save Student Notification record with Email & WhatsApp info
      await Notification.create({
        recipient: req.user.id,
        sender: job.createdBy,
        type: 'application_status',
        title: `Application Submitted - ${job.title}`,
        message: `Your application for "${job.title}" at ${job.company?.name || 'Company'} was successfully submitted!`,
        relatedJob: job._id,
        relatedApplication: application._id,
        emailNotification: emailResult,
        whatsappNotification: waResult,
      });
    } catch (notifErr) {
      console.warn('⚠️ Multi-channel notification dispatch warning:', notifErr.message);
    }

    return successResponse(res, 201, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in student's applications
 * @route   GET /api/applications/my
 * @access  Private (Student)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort({ appliedAt: -1 });

    return successResponse(res, 200, 'Applications fetched successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        populate: { path: 'company' },
      })
      .populate('student', 'name email');

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    // Verify permission
    const isStudent = application.student._id.toString() === req.user.id;
    const isJobCreator = application.job.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isStudent && !isJobCreator && !isAdmin) {
      return errorResponse(res, 403, 'Not authorized to view this application');
    }

    return successResponse(res, 200, 'Application details fetched successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status (Recruiter / Admin) + Dispatch Email & WhatsApp
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Recruiter / Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        select: 'title createdBy company',
        populate: { path: 'company', select: 'name' }
      })
      .populate('student', 'name email');

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    // Check recruiter authorization
    if (application.job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this application status');
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    // Fetch student profile for phone number
    const studentProfile = await StudentProfile.findOne({ user: application.student._id });

    // 1. Dispatch Multi-Channel Notifications (Email & WhatsApp)
    let emailResult = { sent: false };
    let whatsappResult = { sent: false };

    try {
      // 📧 Send Email Notification
      emailResult = await sendApplicationStatusEmail({
        studentName: application.student.name,
        studentEmail: application.student.email,
        jobTitle: application.job.title,
        companyName: application.job.company?.name || 'Partner Company',
        status,
        matchScore: application.matchScore,
      });

      // 💬 Generate WhatsApp Notification & Deep Link
      whatsappResult = await sendWhatsAppStatusNotification({
        studentName: application.student.name,
        studentPhone: studentProfile?.phone || '9876543210',
        jobTitle: application.job.title,
        companyName: application.job.company?.name || 'Partner Company',
        status,
        matchScore: application.matchScore,
      });
    } catch (deliveryError) {
      console.warn('⚠️ Multi-channel notification delivery error:', deliveryError.message);
    }

    // 2. Create in-app Notification with Email & WhatsApp payload
    const notification = await Notification.create({
      recipient: application.student._id,
      sender: req.user.id,
      type: 'application_status',
      title: `Application Status Updated: ${status}`,
      message: `Your application status for "${application.job.title}" has been updated from "${previousStatus}" to "${status}".`,
      relatedJob: application.job._id,
      relatedApplication: application._id,
      emailNotification: emailResult,
      whatsappNotification: whatsappResult,
    });

    // 3. Emit live WebSockets to student
    try {
      emitNotificationToUser(application.student._id.toString(), notification);
    } catch (e) {
      // Non-blocking socket error
    }

    return successResponse(
      res,
      200,
      `Application status updated to "${status}". Email and WhatsApp notifications dispatched!`,
      {
        application,
        notification,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw application (Student)
 * @route   DELETE /api/applications/:id
 * @access  Private (Student)
 */
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    if (application.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to withdraw this application');
    }

    await Application.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, 'Application withdrawn successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applicants for a specific job (Recruiter)
 * @route   GET /api/recruiter/jobs/:id/applicants
 * @access  Private (Recruiter / Admin)
 */
const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to view applicants for this job');
    }

    const applications = await Application.find({ job: req.params.id })
      .populate('student', 'name email')
      .sort({ matchScore: -1, appliedAt: -1 });

    // Populate student profiles
    const applicantsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await StudentProfile.findOne({ user: app.student._id });
        return {
          ...app.toObject(),
          studentProfile: profile,
        };
      })
    );

    return successResponse(res, 200, 'Applicants fetched successfully', applicantsWithProfiles);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplicants,
};
