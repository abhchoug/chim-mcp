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

export class ChimClient {
    private baseUrl: string;
    private apiKey: string | undefined;
    private userAgent: string;

    constructor(config: ChimConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.apiKey = config.apiKey;
        this.userAgent = config.userAgent;
    }

    /**
     * Sends an HTTP request to the CHIM API and returns the parsed JSON (if any).
     */
    async request<T>(options: RequestOptions): Promise<T> {
        const method = options.method ?? 'GET';
        const url = this.buildUrl(options.path, options.query);

        const headers: Record<string, string> = {
            'User-Agent': this.userAgent,
            Accept: 'application/json'
        };

        if ((options.requiresAuth ?? true) && this.apiKey) {
            headers.Authorization = `Api-Key ${this.apiKey}`;
        } else if (options.requiresAuth ?? true) {
            throw new Error('An API key is required for this request. Please set CHIM_API_KEY.');
        }

        let body: string | undefined;
        if (options.body !== undefined) {
            body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            headers['Content-Type'] = 'application/json';
        }

        const requestInit: RequestInit = {
            method,
            headers
        };

        if (body !== undefined) {
            requestInit.body = body;
        }

        const response = await fetch(url, requestInit);

        const raw = await response.text();
        if (!response.ok) {
            throw new Error(
                `CHIM API request failed (${response.status} ${response.statusText})${raw ? `: ${raw}` : ''}`
            );
        }

        if (!raw) {
            return undefined as T;
        }

        try {
            return JSON.parse(raw) as T;
        } catch {
            return raw as T;
        }
    }

    private buildUrl(path: string, query?: RequestOptions['query']): string {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = new URL(`${this.baseUrl}${normalizedPath}`);

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value === undefined || value === null) continue;
                url.searchParams.set(key, String(value));
            }
        }

        return url.toString();
    }
}
