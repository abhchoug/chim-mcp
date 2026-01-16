import { type ChimConfig } from './config.js';
export type RequestOptions = {
    path: string;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    /**
     * Some informational endpoints do not require auth.
     */
    requiresAuth?: boolean;
};
export declare class ChimClient {
    private baseUrl;
    private apiKey;
    private userAgent;
    constructor(config: ChimConfig);
    /**
     * Sends an HTTP request to the CHIM API and returns the parsed JSON (if any).
     */
    request<T>(options: RequestOptions): Promise<T>;
    private buildUrl;
}
//# sourceMappingURL=chimClient.d.ts.map