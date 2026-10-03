const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Register a new user (Student or Recruiter)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department, graduationYear, cgpa, companyName, industry, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists.');
    }

    const assignedRole = role && ['student', 'recruiter'].includes(role) ? role : 'student';

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
    });

    // Automatically create profile/company depending on role
    if (assignedRole === 'student') {
      await StudentProfile.create({
        user: user._id,
        department: department || 'Information Technology',
        graduationYear: graduationYear || new Date().getFullYear() + 1,
        cgpa: cgpa || 8.0,
      });
    } else if (assignedRole === 'recruiter') {
      await Company.create({
        name: companyName || `${name}'s Company`,
        description: 'Default company description. Please update your company profile.',
        industry: industry || 'Technology',
        location: location || 'Remote',
        recruiter: user._id,
      });
    }

    // Generate Auth Token
    const token = user.generateAuthToken();

    return successResponse(
      res,
      201,
      'User registered successfully',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        token,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email address or password.');
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email address or password.');
    }

    // Generate Token
    const token = user.generateAuthToken();

    return successResponse(
      res,
      200,
      'Login successful',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        token,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profileData = null;

    if (user.role === 'student') {
      profileData = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await Company.findOne({ recruiter: user._id });
    }

    return successResponse(res, 200, 'User profile fetched successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      profile: profileData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
