#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getUserConfigPath, loadConfig, saveUserConfig } from './config.js';
import { ChimClient } from './chimClient.js';
import { pathToFileURL } from 'node:url';

const config = loadConfig();
const chimClient = new ChimClient(config);

const server = new McpServer({
    name: 'chim-mcp',
    version: '0.1.0'
});

const PaginationSchema = z.object({
    page: z.number().int().positive().optional().describe('Page number to fetch (1-based).'),
    page_size: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of records to fetch per page (1-100).'),
    search: z.string().min(1).optional().describe('Search keyword supported by the CHIM API.')
});

const PayloadSchema = z.object({
    payload: z
        .union([
            z
                .string()
                .describe('JSON string payload that matches the CHIM API schema for the relevant endpoint.'),
            z
                .record(z.string(), z.unknown())
                .describe('Object payload that matches the CHIM API schema for the relevant endpoint.')
        ])
        .describe('Payload you want to send to CHIM.'),
    dry_run: z
        .boolean()
        .optional()
        .describe('Skip sending the request and only validate that the payload is valid JSON.')
});

server.registerTool(
    'chim_save_api_key',
    {
        description:
            'Stores the CHIM API key in the user config file (~/.config/chim-mcp/config.json).',
        inputSchema: z.object({
            api_key: z.string().min(1).describe('CHIM API key to store locally.'),
            base_url: z
                .string()
                .min(1)
                .optional()
                .describe('Optional override for the CHIM API base URL.'),
            user_agent: z
                .string()
                .min(1)
                .optional()
                .describe('Optional override for the User-Agent header.')
        })
    },
    async ({ api_key, base_url, user_agent }) => {
        const update: Record<string, string> = {
            apiKey: api_key
        };
        if (base_url) {
            update.baseUrl = base_url;
        }
        if (user_agent) {
            update.userAgent = user_agent;
        }

        await saveUserConfig(update);
        return toTextContent({
            saved: true,
            path: getUserConfigPath()
        });
    }
);

server.registerTool(
    'chim_get_change_freeze_status',
    {
        description: 'Returns the change-freeze status for CHIM and each product suite (GET /api/status/).',
        inputSchema: z.object({})
    },
    async () => {
        const response = await chimClient.request<unknown>({
            path: '/api/status/',
            method: 'GET',
            requiresAuth: false
        });
        return toTextContent(response);
    }
);

server.registerTool(
    'chim_list_changes',
    {
        description: 'Lists change notifications (GET /api/v1/changes/). Supports pagination query params.',
        inputSchema: PaginationSchema
    },
    async ({ page, page_size, search }) => {
        const response = await chimClient.request<unknown>({
            path: '/api/v1/changes/',
            query: {
                page,
                page_size,
                search
            }
        });
        return toTextContent(response);
    }
);

server.registerTool(
    'chim_create_change',
    {
        description:
            'Creates a Change notification (POST /api/v1/changes/). Provide the payload documented in the CHIM API guide.',
        inputSchema: PayloadSchema
    },
    async ({ payload, dry_run }) => {
        const parsedPayload = parsePayload(payload);
        if (dry_run) {
            return toTextContent({
                dryRun: true,
                payload: parsedPayload
            });
        }

        const response = await chimClient.request<unknown>({
            path: '/api/v1/changes/',
            method: 'POST',
            body: parsedPayload
        });

        return toTextContent(response);
    }
);

server.registerTool(
    'chim_list_outages',
    {
        description: 'Lists incident/outage notifications (GET /api/v1/outages/). Supports pagination query params.',
        inputSchema: PaginationSchema
    },
    async ({ page, page_size, search }) => {
        const response = await chimClient.request<unknown>({
            path: '/api/v1/outages/',
            query: {
                page,
                page_size,
                search
            }
        });
        return toTextContent(response);
    }
);

server.registerTool(
    'chim_create_outage',
    {
        description:
            'Creates an Incident/Outage notification (POST /api/v1/outages/). Provide the payload documented in the CHIM API guide.',
        inputSchema: PayloadSchema
    },
    async ({ payload, dry_run }) => {
        const parsedPayload = parsePayload(payload);
        if (dry_run) {
            return toTextContent({
                dryRun: true,
                payload: parsedPayload
            });
        }

        const response = await chimClient.request<unknown>({
            path: '/api/v1/outages/',
            method: 'POST',
            body: parsedPayload
        });
        return toTextContent(response);
    }
);

server.registerTool(
    'chim_list_retros',
    {
        description: 'Lists retrospectives created in CHIM (GET /api/v1/retros/). Supports pagination query params.',
        inputSchema: PaginationSchema
    },
    async ({ page, page_size, search }) => {
        const response = await chimClient.request<unknown>({
            path: '/api/v1/retros/',
            query: {
                page,
                page_size,
                search
            }
        });
        return toTextContent(response);
    }
);

function parsePayload(input: unknown): unknown {
    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch (error) {
            throw new Error(`Unable to parse payload JSON: ${(error as Error).message}`);
        }
    }
    return input;
}

function toTextContent(payload: unknown) {
    return {
        content: [
            {
                type: 'text' as const,
                text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)
            }
        ]
    };
}

export async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('CHIM MCP server is ready.');
}

const executedFileUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;

if (executedFileUrl && import.meta.url === executedFileUrl) {
    main().catch(error => {
        console.error('Failed to start CHIM MCP server:', error);
        process.exit(1);
    });
}

export { server, chimClient };
