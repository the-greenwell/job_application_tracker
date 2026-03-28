import api from "./api";
import { ENDPOINTS } from "../constants/api";

const JOBAPPS = ENDPOINTS.JOBAPPS;

const getJobApplications = async () => {
    const response = await api.get(`${JOBAPPS}`);
    return response.data;
};

const createJobApplication = async (payload) => {
    const {title, company, source, job_url} = payload;
    const response = await api.post(`${JOBAPPS}`, {title, company, source, job_url});
    return response.data;
};

const updatJobApplication = async (job_id, payload) => {
    const {title, company, source, job_url} = payload;
    const response = await api.put(`${JOBAPPS}/${job_id}`, {title, company, source, job_url});
    return response.data;
};

const deleteJobApplication = async (job_id) => {
    const response = await api.delete(`${JOBAPPS}/${job_id}`);
    return response.data;
};

export {
    getJobApplications,
    createJobApplication,
    updatJobApplication,
    deleteJobApplication
};