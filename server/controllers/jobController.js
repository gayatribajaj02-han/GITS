const Job = require('../models/Job');
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { matchSkills } = require('../services/skillMatcherService');
const { fetchAndIngestMarketJobs } = require('../services/jobFetcherService');

/**
 * @desc    Get all jobs with search, filtering, sorting, pagination & student skill match calculation
 * @route   GET /api/jobs
 * @access  Public / Optional Auth
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      workMode,
      jobType,
      skill,
      minCGPA,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'active' };

    // Search query across title, description, and requiredSkills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    if (minCGPA) {
      query.minCGPA = { $lte: parseFloat(minCGPA) };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'deadline') {
      sortOptions = { deadline: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo website industry location')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // If authenticated student, calculate skill match score & compatibility arrays
    let studentSkills = [];
    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user.id });
      if (profile && profile.skills) {
        studentSkills = profile.skills;
      }
    }

    const processedJobs = jobs.map((jobDoc) => {
      const job = jobDoc.toObject();
      if (studentSkills.length > 0) {
        const matchResult = matchSkills(studentSkills, job.requiredSkills);
        job.matchScore = matchResult.matchScore;
        job.matchedSkills = matchResult.matchedSkills;
        job.missingSkills = matchResult.missingSkills;
      }
      return job;
    });

    return successResponse(res, 200, 'Jobs fetched successfully', processedJobs, {
      total: totalJobs,
      page: pageNum,
      pages: Math.ceil(totalJobs / limitNum),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job details by ID
 * @route   GET /api/jobs/:id
 * @access  Public / Optional Auth
 */
const getJobById = async (req, res, next) => {
  try {
    const jobDoc = await Job.findById(req.params.id).populate('company');
    if (!jobDoc) {
      return errorResponse(res, 404, 'Job posting not found');
    }

    const job = jobDoc.toObject();

    if (req.user && req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user.id });
      if (profile && profile.skills) {
        const matchResult = matchSkills(profile.skills, job.requiredSkills);
        job.matchScore = matchResult.matchScore;
        job.matchedSkills = matchResult.matchedSkills;
        job.missingSkills = matchResult.missingSkills;
      }
    }

    return successResponse(res, 200, 'Job details fetched successfully', job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job posting (Recruiter)
 * @route   POST /api/jobs
 * @access  Private (Recruiter / Admin)
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      responsibilities,
      requiredSkills,
      location,
      workMode,
      jobType,
      salary,
      minCGPA,
      eligibleDepartments,
      openings,
      deadline,
    } = req.body;

    const company = await Company.findOne({ recruiter: req.user.id });
    if (!company && req.user.role !== 'admin') {
      return errorResponse(res, 400, 'Please complete your company profile before posting jobs.');
    }

    const job = await Job.create({
      title,
      company: company ? company._id : req.body.companyId,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
      location,
      workMode,
      jobType,
      salary,
      minCGPA: minCGPA || 7.0,
      eligibleDepartments: Array.isArray(eligibleDepartments) ? eligibleDepartments : [eligibleDepartments],
      openings: openings || 1,
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      createdBy: req.user.id,
    });

    return successResponse(res, 201, 'Job posted successfully', job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter / Admin)
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this job posting');
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Job posting updated successfully', updatedJob);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter / Admin)
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this job posting');
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id });

    return successResponse(res, 200, 'Job and associated applications deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job status (active, closed, pending)
 * @route   PATCH /api/jobs/:id/status
 * @access  Private (Recruiter / Admin)
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'closed', 'pending'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status value');
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to change status of this job');
    }

    job.status = status;
    await job.save();

    return successResponse(res, 200, `Job status updated to ${status}`, job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sync & Ingest live developer jobs from global APIs into MongoDB
 * @route   POST /api/jobs/sync-market-jobs
 * @access  Public / Admin / Recruiter
 */
const syncMarketJobs = async (req, res, next) => {
  try {
    const result = await fetchAndIngestMarketJobs();
    return successResponse(res, 200, `Market sync complete. ${result.count} new live market jobs ingested into database!`, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  syncMarketJobs,
};
