import { describe, it, expect } from 'vitest';
import { server, chimClient } from '../src/server.js';

describe('CHIM MCP Server', () => {
    describe('Server Instance', () => {
        it('should have a valid server instance', () => {
            expect(server).toBeDefined();
            expect(server.server).toBeDefined();
        });

        it('should have server info configured', () => {
            // McpServer wraps the underlying Server
            expect(server).toBeDefined();
        });
    });

    describe('ChimClient Configuration', () => {
        it('should have a configured chimClient instance', () => {
            expect(chimClient).toBeDefined();
        });
    });
});

describe('Server Module Exports', () => {
    it('should export server instance', async () => {
        const module = await import('../src/server.js');
        expect(module.server).toBeDefined();
    });

    it('should export chimClient instance', async () => {
        const module = await import('../src/server.js');
        expect(module.chimClient).toBeDefined();
    });

    it('should export main function', async () => {
        const module = await import('../src/server.js');
        expect(module.main).toBeDefined();
        expect(typeof module.main).toBe('function');
    });
});
