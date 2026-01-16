import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DEFAULT_BASE_URL, DEFAULT_USER_AGENT, loadConfig, ensureApiKey } from '../src/config.js';

describe('Config', () => {
    describe('Default Values', () => {
        it('should have correct default base URL', () => {
            expect(DEFAULT_BASE_URL).toBe('https://api.chim.umbrella.com');
        });

        it('should have correct default user agent', () => {
            expect(DEFAULT_USER_AGENT).toBe('chim-mcp/0.1.0');
        });
    });

    describe('loadConfig', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            vi.resetModules();
            process.env = { ...originalEnv };
        });

        afterEach(() => {
            process.env = originalEnv;
        });

        it('should use environment variable for API key when set', () => {
            process.env.CHIM_API_KEY = 'env-api-key';

            // Re-import to get fresh config
            const config = loadConfig();
            expect(config.apiKey).toBe('env-api-key');
        });

        it('should use environment variable for base URL when set', () => {
            process.env.CHIM_API_BASE_URL = 'https://custom.api.url';

            const config = loadConfig();
            expect(config.baseUrl).toBe('https://custom.api.url');
        });

        it('should use default base URL when env not set', () => {
            delete process.env.CHIM_API_BASE_URL;

            const config = loadConfig();
            expect(config.baseUrl).toBe(DEFAULT_BASE_URL);
        });
    });

    describe('ensureApiKey', () => {
        it('should return API key when present', () => {
            const config = {
                baseUrl: DEFAULT_BASE_URL,
                userAgent: DEFAULT_USER_AGENT,
                apiKey: 'test-key'
            };

            expect(ensureApiKey(config)).toBe('test-key');
        });

        it('should throw error when API key is missing', () => {
            const config = {
                baseUrl: DEFAULT_BASE_URL,
                userAgent: DEFAULT_USER_AGENT
            };

            expect(() => ensureApiKey(config)).toThrow('Missing CHIM_API_KEY');
        });
    });
});
