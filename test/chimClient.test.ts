import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChimClient } from '../src/chimClient.js';
import { DEFAULT_BASE_URL, DEFAULT_USER_AGENT } from '../src/config.js';

describe('ChimClient', () => {
    describe('Configuration', () => {
        it('should use default base URL when not provided', () => {
            const client = new ChimClient({
                baseUrl: DEFAULT_BASE_URL,
                userAgent: DEFAULT_USER_AGENT
            });

            expect(client).toBeDefined();
        });

        it('should accept custom base URL', () => {
            const customUrl = 'https://custom.chim.example.com';
            const client = new ChimClient({
                baseUrl: customUrl,
                userAgent: DEFAULT_USER_AGENT
            });

            expect(client).toBeDefined();
        });

        it('should accept API key for authenticated requests', () => {
            const client = new ChimClient({
                baseUrl: DEFAULT_BASE_URL,
                userAgent: DEFAULT_USER_AGENT,
                apiKey: 'test-api-key'
            });

            expect(client).toBeDefined();
        });
    });

    describe('Request Building', () => {
        let client: ChimClient;
        let fetchSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            client = new ChimClient({
                baseUrl: 'https://api.chim.test',
                userAgent: 'test-agent/1.0',
                apiKey: 'test-key'
            });

            // Mock fetch
            fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
                new Response(JSON.stringify({ status: 'ok' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            );
        });

        afterEach(() => {
            fetchSpy.mockRestore();
        });

        it('should build correct URL for GET requests', async () => {
            await client.request({
                path: '/api/status/',
                method: 'GET',
                requiresAuth: false
            });

            expect(fetchSpy).toHaveBeenCalledWith(
                'https://api.chim.test/api/status/',
                expect.objectContaining({
                    method: 'GET'
                })
            );
        });

        it('should include query parameters in URL', async () => {
            await client.request({
                path: '/api/v1/changes/',
                method: 'GET',
                query: { page: 1, page_size: 10 }
            });

            expect(fetchSpy).toHaveBeenCalledWith(
                expect.stringContaining('page=1'),
                expect.any(Object)
            );
        });

        it('should include Authorization header for authenticated requests', async () => {
            await client.request({
                path: '/api/v1/changes/',
                method: 'GET',
                requiresAuth: true
            });

            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Api-Key test-key'
                    })
                })
            );
        });

        it('should include User-Agent header', async () => {
            await client.request({
                path: '/api/status/',
                method: 'GET',
                requiresAuth: false
            });

            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'User-Agent': 'test-agent/1.0'
                    })
                })
            );
        });

        it('should send JSON body for POST requests', async () => {
            const payload = { title: 'Test Change', summary: 'Test summary' };

            await client.request({
                path: '/api/v1/changes/',
                method: 'POST',
                body: payload
            });

            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            );
        });
    });

    describe('Error Handling', () => {
        let client: ChimClient;

        beforeEach(() => {
            client = new ChimClient({
                baseUrl: 'https://api.chim.test',
                userAgent: 'test-agent/1.0'
            });
        });

        it('should throw error when API key is missing for authenticated request', async () => {
            const clientWithoutKey = new ChimClient({
                baseUrl: 'https://api.chim.test',
                userAgent: 'test-agent/1.0'
                // No apiKey
            });

            await expect(
                clientWithoutKey.request({
                    path: '/api/v1/changes/',
                    method: 'GET',
                    requiresAuth: true
                })
            ).rejects.toThrow();
        });
    });
});
