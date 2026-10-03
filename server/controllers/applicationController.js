const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { matchSkills } = require('../services/skillMatcherService');
const { emitNotificationToUser } = require('../socket/socketManager');

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
      return errorResponse(res, 400, 'This job posting is no longer active.');
    }

    // Check application deadline
    if (new Date() > new Date(job.deadline)) {
      return errorResponse(res, 400, 'Application deadline for this job has passed.');
    }

    // Check duplicate application
    const existingApp = await Application.findOne({ student: req.user.id, job: jobId });
    if (existingApp) {
      return errorResponse(res, 409, 'You have already applied for this job.');
    }

    // Fetch Student Profile & check eligibility criteria
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return errorResponse(res, 400, 'Please complete your student profile before applying.');
    }

    // CGPA Eligibility Check
    if (studentProfile.cgpa < job.minCGPA) {
      return errorResponse(
        res,
        400,
        `Your CGPA (${studentProfile.cgpa}) does not meet the minimum requirement (${job.minCGPA}) for this job.`
      );
    }

    // Department Eligibility Check
    if (
      job.eligibleDepartments &&
      job.eligibleDepartments.length > 0 &&
      !job.eligibleDepartments.includes(studentProfile.department)
    ) {
      return errorResponse(
        res,
        400,
        `Students from ${studentProfile.department} department are not eligible for this role.`
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

    // Send Notification to Recruiter
    const notificationObj = await Notification.create({
      recipient: job.createdBy,
      sender: req.user.id,
      type: 'new_application',
      title: `New Candidate Applied - ${job.title}`,
      message: `${req.user.name} applied for "${job.title}" with a ${skillMatchResult.matchScore}% skill match score.`,
      relatedJob: job._id,
      relatedApplication: application._id,
    });

    // Real-time WebSockets emit to recruiter
    try {
      emitNotificationToUser(job.createdBy.toString(), notificationObj);
    } catch (e) {
      // Non-blocking socket error
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

    return successResponse(res, 200, 'Student applications fetched successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application details
 * @route   GET /api/applications/:id
 * @access  Private (Student / Recruiter / Admin)
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email phone profileImage')
      .populate({
        path: 'job',
        populate: { path: 'company' },
      });

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
 * @desc    Update application status (Recruiter / Admin)
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
      .populate('job', 'title createdBy')
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

    // Create persistent notification for Student
    const notification = await Notification.create({
      recipient: application.student._id,
      sender: req.user.id,
      type: 'application_status',
      title: `Application Status Updated: ${status}`,
      message: `Your application status for "${application.job.title}" has been updated from "${previousStatus}" to "${status}".`,
      relatedJob: application.job._id,
      relatedApplication: application._id,
    });

    // Real-time WebSockets emit to student
    try {
      emitNotificationToUser(application.student._id.toString(), notification);
    } catch (e) {
      // Non-blocking socket error
    }

    return successResponse(
      res,
      200,
      `Application status updated to "${status}"`,
      application
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

    if (application.student.toString() !== req.user.id) {
      return errorResponse(res, 403, 'Not authorized to withdraw this application');
    }

    if (application.status !== 'Applied') {
      return errorResponse(
        res,
        400,
        `Cannot withdraw application once it has progressed beyond "Applied" status (current: ${application.status}).`
      );
    }

    await Application.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Application withdrawn successfully');
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
};
