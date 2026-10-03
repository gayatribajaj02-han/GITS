const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/checkRole');

router.use(protect);

router.post('/', authorize('student'), applyForJob);
router.get('/my', authorize('student'), getMyApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', authorize('student'), withdrawApplication);

module.exports = router;
