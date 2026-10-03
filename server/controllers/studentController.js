const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get student profile for logged-in user
 * @route   GET /api/students/profile
 * @access  Private (Student)
 */
const getStudentProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email phone profileImage');

    if (!profile) {
      // Create empty profile if none exists
      profile = await StudentProfile.create({
        user: req.user.id,
        department: 'Information Technology',
        graduationYear: new Date().getFullYear() + 1,
        cgpa: 8.0,
      });
      profile = await profile.populate('user', 'name email phone profileImage');
    }

    return successResponse(res, 200, 'Student profile fetched successfully', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student profile details
 * @route   PUT /api/students/profile
 * @access  Private (Student)
 */
const updateStudentProfile = async (req, res, next) => {
  try {
    const {
      college,
      department,
      degree,
      graduationYear,
      cgpa,
      about,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      name,
      phone,
    } = req.body;

    // Update user basic info if provided
    if (name || phone) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    if (college !== undefined) profile.college = college;
    if (department !== undefined) profile.department = department;
    if (degree !== undefined) profile.degree = degree;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (about !== undefined) profile.about = about;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) profile.portfolioUrl = portfolioUrl;

    await profile.save();
    profile = await profile.populate('user', 'name email phone profileImage');

    return successResponse(res, 200, 'Student profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student skills list
 * @route   PUT /api/students/skills
 * @access  Private (Student)
 */
const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return errorResponse(res, 400, 'Skills must be an array of strings');
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id, department: 'IT', graduationYear: 2026, cgpa: 8.0 });
    }

    profile.skills = [...new Set(skills.map(s => s.trim()).filter(Boolean))];
    await profile.save();

    return successResponse(res, 200, 'Skills updated successfully', {
      skills: profile.skills,
      profileCompletion: profile.profileCompletion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new project to profile
 * @route   POST /api/students/projects
 * @access  Private (Student)
 */
const addProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl } = req.body;

    if (!title || !description) {
      return errorResponse(res, 400, 'Project title and description are required');
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    profile.projects.push({
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
    });

    await profile.save();

    return successResponse(res, 201, 'Project added successfully', profile.projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project from profile
 * @route   DELETE /api/students/projects/:id
 * @access  Private (Student)
 */
const deleteProject = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    profile.projects = profile.projects.filter(p => p._id.toString() !== req.params.id);
    await profile.save();

    return successResponse(res, 200, 'Project deleted successfully', profile.projects);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  updateSkills,
  addProject,
  deleteProject,
};
