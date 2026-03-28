import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

import api from '../src/services/api';
import {
    getJobApplications,
    createJobApplication,
    updateJobApplication,
    deleteJobApplication,
} from '../src/services/jobAppService';

describe('Job Application Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getJobApplications', () => {
        it('should call the correct endpoint', async () => {
            const mockData = [{ _id: '1', title: 'Engineer', company: 'Acme' }];
            api.get.mockResolvedValue({ data: mockData });

            const result = await getJobApplications();

            expect(api.get).toHaveBeenCalledWith('/job-apps');
            expect(result).toEqual(mockData);
        });

        it('should throw if the API call fails', async () => {
            api.get.mockRejectedValue(new Error('Unauthorized'));
            await expect(getJobApplications()).rejects.toThrow('Unauthorized');
        });
    });

    describe('createJobApplication', () => {
        it('should call the correct endpoint with the correct payload', async () => {
            const mockData = { _id: '1', title: 'Engineer', company: 'Acme' };
            api.post.mockResolvedValue({ data: mockData });

            const payload = {
                title: 'Engineer',
                company: 'Acme',
                source: 'LinkedIn',
                job_url: 'https://acme.com/jobs/1',
            };

            const result = await createJobApplication(payload);

            expect(api.post).toHaveBeenCalledWith('/job-apps', payload);
            expect(result).toEqual(mockData);
        });

        it('should only send the expected fields, ignoring extra payload fields', async () => {
            api.post.mockResolvedValue({ data: {} });

            await createJobApplication({
                title: 'Engineer',
                company: 'Acme',
                source: 'LinkedIn',
                job_url: 'https://acme.com/jobs/1',
                status: 'Interviewing', 
            });

            expect(api.post).toHaveBeenCalledWith('/job-apps', {
                title: 'Engineer',
                company: 'Acme',
                source: 'LinkedIn',
                job_url: 'https://acme.com/jobs/1',
            });
        });

        it('should throw if the API call fails', async () => {
            api.post.mockRejectedValue(new Error('Validation error'));
            await expect(createJobApplication({ title: 'Engineer', company: 'Acme' }))
                .rejects.toThrow('Validation error');
        });
    });

    describe('updateJobApplication', () => {
        it('should call the correct endpoint with job_id and payload', async () => {
            const mockData = { _id: '1', title: 'Senior Engineer', company: 'Acme' };
            api.put.mockResolvedValue({ data: mockData });

            const result = await updateJobApplication('1', {
                title: 'Senior Engineer',
                company: 'Acme',
                source: 'LinkedIn',
                job_url: 'https://acme.com/jobs/1',
            });

            expect(api.put).toHaveBeenCalledWith('/job-apps/1', {
                title: 'Senior Engineer',
                company: 'Acme',
                source: 'LinkedIn',
                job_url: 'https://acme.com/jobs/1',
            });
            expect(result).toEqual(mockData);
        });

        it('should throw if the API call fails', async () => {
            api.put.mockRejectedValue(new Error('Not found'));
            await expect(updateJobApplication('999', { title: 'x', company: 'x' }))
                .rejects.toThrow('Not found');
        });
    });

    describe('deleteJobApplication', () => {
        it('should call the correct endpoint with job_id', async () => {
            api.delete.mockResolvedValue({ data: { message: 'Deleted' } });

            const result = await deleteJobApplication('1');

            expect(api.delete).toHaveBeenCalledWith('/job-apps/1');
            expect(result).toEqual({ message: 'Deleted' });
        });

        it('should throw if the API call fails', async () => {
            api.delete.mockRejectedValue(new Error('Not found'));
            await expect(deleteJobApplication('999')).rejects.toThrow('Not found');
        });
    });
});