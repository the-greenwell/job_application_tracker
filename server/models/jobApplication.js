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
    },
    job_url: {
        type: String,
    },
    status: {
        type: String,
        default: 'Applied',
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
    }, {timestamps: true});

    module.exports = mongoose.model('JobApplication', JobApplication);
