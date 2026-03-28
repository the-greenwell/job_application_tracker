import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios', () => {
    const mockInstance = {
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        post: vi.fn(),
        get: vi.fn(),
    };

    const create = vi.fn(() => mockInstance);
    create._mockInstance = mockInstance;

    return {
        default: {
            create,
            post: vi.fn(),
        },
    };
});

import axios from 'axios';
import {
    setAccessToken,
    clearAccessToken,
    registerExpiredSessionHandler,
} from '../src/services/api';

describe('API Service', () => {
    beforeEach(() => {
        clearAccessToken();
    });

    describe('setAccessToken / clearAccessToken', () => {
        it('should set the access token without throwing', () => {
            expect(() => setAccessToken('test-token')).not.toThrow();
        });

        it('should clear the access token without throwing', () => {
            setAccessToken('test-token');
            expect(() => clearAccessToken()).not.toThrow();
        });
    });

    describe('registerExpiredSessionHandler', () => {
        it('should register a callback without throwing', () => {
            const handler = vi.fn();
            expect(() => registerExpiredSessionHandler(handler)).not.toThrow();
        });
    });

    describe('request interceptor', () => {
        it('should register a request interceptor on the axios instance', () => {
            const mockInstance = axios.create._mockInstance;
            expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
        });

        it('should register a response interceptor on the axios instance', () => {
            const mockInstance = axios.create._mockInstance;
            expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
        });
    });
});