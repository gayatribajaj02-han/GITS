const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, default: '' },
  startYear: { type: Number },
  endYear: { type: Number },
  grade: { type: String, default: '' },
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
});

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date },
  credentialUrl: { type: String, default: '' },
});

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, default: '' },
});

const StudentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    college: {
      type: String,
      default: 'Government Engineering College',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    degree: {
      type: String,
      default: 'B.Tech IT',
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot exceed 10'],
      required: [true, 'CGPA is required'],
    },
    about: {
      type: String,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [EducationSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    experience: [ExperienceSchema],
    resumeUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    profileCompletion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to calculate profile completion %
StudentProfileSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  if (this.department) score += 15;
  if (this.graduationYear) score += 10;
  if (this.cgpa) score += 10;
  if (this.about && this.about.length > 20) score += 15;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.projects && this.projects.length > 0) score += 15;
  if (this.resumeUrl) score += 10;
  if (this.githubUrl || this.linkedinUrl) score += 5;
  
  this.profileCompletion = Math.min(100, score);
  return this.profileCompletion;
};

// Calculate completion percentage before saving
StudentProfileSchema.pre('save', function (next) {
  this.calculateProfileCompletion();
  next();
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
