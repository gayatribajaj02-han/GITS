const { body } = require('express-validator');

const jobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requiredSkills').isArray({ min: 1 }).withMessage('At least one required skill is needed'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('workMode').isIn(['On-site', 'Remote', 'Hybrid']).withMessage('Invalid work mode'),
  body('jobType').isIn(['Full Time', 'Internship', 'Part Time']).withMessage('Invalid job type'),
  body('salary').trim().notEmpty().withMessage('Salary/Stipend info is required'),
  body('openings').isInt({ min: 1 }).withMessage('Openings must be at least 1'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required'),
];

module.exports = { jobValidator };
