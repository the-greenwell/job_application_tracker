const JobApplication = require('../models/jobApplication');

const getJobApplications = async (req, res) => {
    try {
        const authorizedUser = req.user;
        const jobApplications = await JobApplication.find({archived: { $ne: true }, user: authorizedUser.id});
        res.status(200).json({ success: true, allApplications: jobApplications });
    } catch (error) {
        res.status(500).json({ error: 'Get Job Applications', message: error.message});
    };
};

const createJobApplication = async (req, res) => {
    try {
        const authorizedUser = req.user;
        const {title, company, source, job_url} = req.body;
        const newJobApplication = {title, company, source, job_url, user: authorizedUser.id};
        const savedApplication = await JobApplication.create(newJobApplication);
        res.status(200).json({ success: true, createdApplication: savedApplication });
    } catch (error) {
        res.status(500).json({ error: 'Post New Job Application', message: error.message });
    };
};

const updateJobApplication = async (req, res) => {
    try {
        const authorizedUser = req.user;
        const jobApplicationID = req.params.id;
        const updatedApplication = await JobApplication.findOneAndUpdate(
            { _id: jobApplicationID, user: authorizedUser.id },
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
        const authorizedUser = req.user;
        const jobApplicationID = req.params.id;
        const archivedApplication = await JobApplication.findOneAndUpdate(
            { _id: jobApplicationID, user: authorizedUser.id },
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
};