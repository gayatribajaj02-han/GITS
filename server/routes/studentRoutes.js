const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  updateSkills,
  addProject,
  deleteProject,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/checkRole');

// Protect all student routes
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/skills', updateSkills);
router.post('/projects', addProject);
router.delete('/projects/:id', deleteProject);

module.exports = router;
