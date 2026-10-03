const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  syncMarketJobs,
} = require('../controllers/jobController');
const { jobValidator } = require('../validators/jobValidator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/optionalAuth');
const { authorize } = require('../middleware/checkRole');

// Public / Optional Auth routes
router.get('/', optionalAuth, getJobs);
router.post('/sync-market-jobs', syncMarketJobs);
router.get('/:id', optionalAuth, getJobById);

// Protected routes (Recruiter / Admin)
router.post('/', protect, authorize('recruiter', 'admin'), jobValidator, validate, createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.patch('/:id/status', protect, authorize('recruiter', 'admin'), updateJobStatus);

module.exports = router;
