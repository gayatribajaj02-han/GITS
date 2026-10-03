const express = require('express');
const router = express.Router();
const {
  getPlatformAnalytics,
  getAllStudents,
  getAllRecruiters,
  getAllUsers,
  getAllJobs,
  updateJobStatus,
  getAllApplications,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/checkRole');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformAnalytics);
router.get('/analytics', getPlatformAnalytics);
router.get('/students', getAllStudents);
router.get('/recruiters', getAllRecruiters);
router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.get('/applications', getAllApplications);
router.patch('/jobs/:id/status', updateJobStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
