const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get logged-in recruiter's company profile
 * @route   GET /api/recruiter/company
 * @access  Private (Recruiter)
 */
const getCompanyProfile = async (req, res, next) => {
  try {
    let company = await Company.findOne({ recruiter: req.user.id });

    if (!company) {
      company = await Company.create({
        name: `${req.user.name}'s Organization`,
        description: 'Please update your company details.',
        industry: 'Technology',
        location: 'Remote',
        recruiter: req.user.id,
      });
    }

    return successResponse(res, 200, 'Company profile fetched successfully', company);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update recruiter's company details
 * @route   PUT /api/recruiter/company
 * @access  Private (Recruiter)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    const { name, description, logo, website, industry, location } = req.body;

    let company = await Company.findOne({ recruiter: req.user.id });
    if (!company) {
      company = new Company({ recruiter: req.user.id });
    }

    if (name) company.name = name;
    if (description) company.description = description;
    if (logo !== undefined) company.logo = logo;
    if (website !== undefined) company.website = website;
    if (industry) company.industry = industry;
    if (location) company.location = location;

    await company.save();

    return successResponse(res, 200, 'Company profile updated successfully', company);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs created by logged-in recruiter
 * @route   GET /api/recruiter/jobs
 * @access  Private (Recruiter)
 */
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id })
      .populate('company', 'name logo location')
      .sort({ createdAt: -1 });

    // Fetch applicant count for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        const shortlistedCount = await Application.countDocuments({
          job: job._id,
          status: { $in: ['Shortlisted', 'Interview', 'Selected'] },
        });

        return {
          ...job.toObject(),
          applicantCount,
          shortlistedCount,
        };
      })
    );

    return successResponse(res, 200, 'Recruiter jobs fetched successfully', jobsWithCounts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applicants for a specific recruiter job
 * @route   GET /api/recruiter/jobs/:id/applicants
 * @access  Private (Recruiter)
 */
const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    // Verify ownership or admin access
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to view applicants for this job');
    }

    const applications = await Application.find({ job: req.params.id })
      .populate({
        path: 'student',
        select: 'name email phone profileImage',
      })
      .sort({ matchScore: -1, appliedAt: -1 });

    // Fetch student profile details for each applicant
    const detailedApplicants = await Promise.all(
      applications.map(async (app) => {
        const StudentProfile = require('../models/StudentProfile');
        const studentProfile = await StudentProfile.findOne({ user: app.student._id });
        return {
          ...app.toObject(),
          studentProfile: studentProfile || null,
        };
      })
    );

    return successResponse(res, 200, 'Applicants fetched successfully', {
      job: {
        id: job._id,
        title: job.title,
        status: job.status,
        requiredSkills: job.requiredSkills,
      },
      applicants: detailedApplicants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getRecruiterJobs,
  getJobApplicants,
};
