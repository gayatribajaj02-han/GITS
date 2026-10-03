const express = require('express');
const router = express.Router();
const {
  getCompanyProfile,
  updateCompanyProfile,
  getRecruiterJobs,
  getJobApplicants,
} = require('../controllers/recruiterController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/checkRole');

// Protect all recruiter routes
router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/company', getCompanyProfile);
router.put('/company', updateCompanyProfile);
router.get('/jobs', getRecruiterJobs);
router.get('/jobs/:id/applicants', getJobApplicants);

module.exports = router;
