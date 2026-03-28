const { Router } = require('express');
const { authorizeAccessToken } = require('../middleware/authMiddleware');
const { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } = require('../controllers/jobApplicationController');

const router = Router();

router.use(authorizeAccessToken);
router.get('/', getJobApplications);
router.post('/new', createJobApplication);
router.put('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

module.exports = router;