const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobApplication = new Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: false,
    },
    job_url: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: 'Applied',
        required: true,
    },
    archived: {
        type: Boolean,
        required: true,
        default: false,
    },
    }, {timestamps: true});

    module.exports = mongoose.model('JobApplication', JobApplication);