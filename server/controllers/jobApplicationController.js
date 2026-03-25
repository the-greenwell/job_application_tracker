const JobApplication = require('../models/jobApplication');

const getJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find({archived: { $ne: true }});
        res.status(200).json({ success: true, allApplications: jobApplications });
    } catch (error) {
        res.status(500).json({ error: 'Get Job Applications', message: error.message});
    };
};

const createJobApplication = async (req, res) => {
    try {
        const newJobApplication = req.body;
        const savedApplication = await JobApplication.create(newJobApplication);
        res.status(200).json({ success: true, createdApplication: savedApplication });
    } catch (error) {
        res.status(500).json({ error: 'Post New Job Application', message: error.message });
    };
};

const updateJobApplication = async (req, res) => {
    try {
        const jobApplicationID = req.params.id;
        const updatedApplication = await JobApplication.findOneAndUpdate(
            { _id: jobApplicationID },
            req.body,
            { returnDocument: 'after' });

        if (!updatedApplication) return res.status(404).json({ error: 'Update Job Application 1'});
        res.status(200).json({ success: true, updatedApplication: updatedApplication})
    } catch (error) {
        res.status(500).json({ error: 'Update Job Application 2', message: error.message });
    };
};

const deleteJobApplication = async (req, res) => {
    try {
        const jobApplicationID = req.params.id;
        const archivedApplication = await JobApplication.findOneAndUpdate(
            { _id: jobApplicationID },
            { archived: true },
            { returnDocument: 'after' });
        if (!archivedApplication) return res.status(404).json({ error: 'Delete Job Application 1'});
        res.status(200).json({ success: true, archivedApplication: archivedApplication})
    } catch (error) {
        res.status(500).json({ error: 'Delete Job Application 2', message: error.message})
    };
};

module.exports = {
    getJobApplications,
    createJobApplication,
    updateJobApplication,
    deleteJobApplication
}