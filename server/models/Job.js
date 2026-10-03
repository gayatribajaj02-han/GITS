const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: [
      {
        type: String,
      },
    ],
    requiredSkills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Internship', 'Part Time'],
      default: 'Full Time',
    },
    salary: {
      type: String,
      required: [true, 'Salary or stipend details required'],
    },
    minCGPA: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 10,
    },
    eligibleDepartments: [
      {
        type: String,
      },
    ],
    graduationYears: [
      {
        type: Number,
      },
    ],
    openings: {
      type: Number,
      required: [true, 'Number of openings required'],
      min: [1, 'Openings must be at least 1'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'pending'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for job search
JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
JobSchema.index({ status: 1, deadline: 1 });

module.exports = mongoose.model('Job', JobSchema);
