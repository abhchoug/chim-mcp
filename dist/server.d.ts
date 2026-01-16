#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ChimClient } from './chimClient.js';
declare const chimClient: ChimClient;
declare const server: McpServer;
export declare function main(): Promise<void>;
export { server, chimClient };
//# sourceMappingURL=server.d.ts.map