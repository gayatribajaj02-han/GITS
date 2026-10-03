const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get overall placement platform analytics / stats
 * @route   GET /api/admin/analytics (also /api/admin/stats)
 * @access  Private (Admin)
 */
const getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    // Count applications by status
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };

    statusCounts.forEach(item => {
      if (item._id) statusMap[item._id] = item.count;
    });

    const selectedCount = statusMap.Selected || 0;
    const placementRate = totalStudents > 0 ? Math.round((selectedCount / totalStudents) * 100) : 0;

    // Top Demanded Skills from Jobs
    const jobs = await Job.find({}, 'requiredSkills');
    const skillFrequency = {};

    jobs.forEach(j => {
      if (Array.isArray(j.requiredSkills)) {
        j.requiredSkills.forEach(s => {
          const clean = s.trim();
          skillFrequency[clean] = (skillFrequency[clean] || 0) + 1;
        });
      }
    });

    const topSkills = Object.entries(skillFrequency)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Department distribution
    const deptCounts = await StudentProfile.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]);

    const departmentDistribution = deptCounts.map(d => ({
      department: d._id || 'Unassigned',
      students: d.count,
    }));

    return successResponse(res, 200, 'Analytics data fetched successfully', {
      metrics: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        selectedCandidates: selectedCount,
        placementRate,
      },
      statusDistribution: Object.entries(statusMap).map(([status, count]) => ({
        status,
        count,
      })),
      topSkills,
      departmentDistribution,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered students
 * @route   GET /api/admin/students
 * @access  Private (Admin)
 */
const getAllStudents = async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate('user', 'name email phone profileImage createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All students fetched successfully', students);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all recruiters & companies
 * @route   GET /api/admin/recruiters
 * @access  Private (Admin)
 */
const getAllRecruiters = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .populate('recruiter', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All recruiters fetched successfully', companies);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (students, recruiters, admins)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return successResponse(res, 200, 'All users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs for admin view
 * @route   GET /api/admin/jobs
 * @access  Private (Admin)
 */
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name logo location')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All jobs fetched successfully', jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job status (Approve/Close/Reject)
 * @route   PATCH /api/admin/jobs/:id/status
 * @access  Private (Admin)
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    job.status = status;
    if (status === 'active') {
      job.approvedBy = req.user.id;
    }
    await job.save();

    return successResponse(res, 200, `Job status updated to ${status}`, job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications across platform
 * @route   GET /api/admin/applications
 * @access  Private (Admin)
 */
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email phone')
      .populate({
        path: 'job',
        select: 'title company location salary',
        populate: { path: 'company', select: 'name logo' },
      })
      .sort({ appliedAt: -1 });

    return successResponse(res, 200, 'All applications fetched successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account and profile
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (user.role === 'student') {
      await StudentProfile.deleteOne({ user: user._id });
      await Application.deleteMany({ student: user._id });
    } else if (user.role === 'recruiter') {
      await Company.deleteOne({ recruiter: user._id });
      await Job.deleteMany({ createdBy: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformAnalytics,
  getAllStudents,
  getAllRecruiters,
  getAllUsers,
  getAllJobs,
  updateJobStatus,
  getAllApplications,
  deleteUser,
};
