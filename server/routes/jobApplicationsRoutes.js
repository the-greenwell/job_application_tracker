const { Router } = require('express');
const { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } = require('../controllers/jobApplicationController');

const router = Router();

router.get('/', getJobApplications);
router.post('/', createJobApplication);
router.put('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

module.exports = router;