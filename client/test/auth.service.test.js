import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('../src/services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock('axios');

import api from '../src/services/api';
import { register, login, logout, refreshAccessToken } from '../src/services/authService';

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should call the correct endpoint with the correct payload', async () => {
            const mockResponse = { data: { message: 'User created' } };
            api.post.mockResolvedValue(mockResponse);

            const payload = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            const result = await register(payload);

            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should only send the expected fields, ignoring extra payload fields', async () => {
            api.post.mockResolvedValue({ data: {} });

            await register({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'admin', 
            });
            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            });
        });

        it('should throw if the API call fails', async () => {
            api.post.mockRejectedValue(new Error('Network error'));
            await expect(register({ first_name: 'John', last_name: 'Doe', email: 'john@example.com', password: 'password123' }))
                .rejects.toThrow('Network error');
        });
    });

    describe('login', () => {
        it('should call the correct endpoint with email and password', async () => {
            const mockResponse = { data: { accessToken: 'abc123' } };
            api.post.mockResolvedValue(mockResponse);

            const result = await login({ email: 'john@example.com', password: 'password123' });

            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'john@example.com',
                password: 'password123',
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw if the API call fails', async () => {
            api.post.mockRejectedValue(new Error('Invalid credentials'));
            await expect(login({ email: 'john@example.com', password: 'wrong' }))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('logout', () => {
        it('should call the correct endpoint', async () => {
            api.post.mockResolvedValue({ data: { message: 'Logged out' } });

            const result = await logout();

            expect(api.post).toHaveBeenCalledWith('/auth/logout');
            expect(result).toEqual({ message: 'Logged out' });
        });

        it('should throw if the API call fails', async () => {
            api.post.mockRejectedValue(new Error('Server error'));
            await expect(logout()).rejects.toThrow('Server error');
        });
    });

    describe('refreshAccessToken', () => {
        it('should call the refresh endpoint directly with axios (not api)', async () => {
            const mockResponse = { data: { accessToken: 'new-token' } };
            axios.post.mockResolvedValue(mockResponse);

            const result = await refreshAccessToken();

            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/auth/refresh'),
                {},
                { withCredentials: true }
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw if the refresh call fails', async () => {
            axios.post.mockRejectedValue(new Error('Refresh failed'));
            await expect(refreshAccessToken()).rejects.toThrow('Refresh failed');
        });
    });
});