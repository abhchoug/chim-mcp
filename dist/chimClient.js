import {} from './config.js';
export class ChimClient {
    baseUrl;
    apiKey;
    userAgent;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
        this.apiKey = config.apiKey;
        this.userAgent = config.userAgent;
    }
    /**
     * Sends an HTTP request to the CHIM API and returns the parsed JSON (if any).
     */
    async request(options) {
        const method = options.method ?? 'GET';
        const url = this.buildUrl(options.path, options.query);
        const headers = {
            'User-Agent': this.userAgent,
            Accept: 'application/json'
        };
        if ((options.requiresAuth ?? true) && this.apiKey) {
            headers.Authorization = `Api-Key ${this.apiKey}`;
        }
        else if (options.requiresAuth ?? true) {
            throw new Error('An API key is required for this request. Please set CHIM_API_KEY.');
        }
        let body;
        if (options.body !== undefined) {
            body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            headers['Content-Type'] = 'application/json';
        }
        const requestInit = {
            method,
            headers
        };
        if (body !== undefined) {
            requestInit.body = body;
        }
        const response = await fetch(url, requestInit);
        const raw = await response.text();
        if (!response.ok) {
            throw new Error(`CHIM API request failed (${response.status} ${response.statusText})${raw ? `: ${raw}` : ''}`);
        }
        if (!raw) {
            return undefined;
        }
        try {
            return JSON.parse(raw);
        }
        catch {
            return raw;
        }
    }
    buildUrl(path, query) {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const url = new URL(`${this.baseUrl}${normalizedPath}`);
        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value === undefined || value === null)
                    continue;
                url.searchParams.set(key, String(value));
            }
        }
        return url.toString();
    }
}
//# sourceMappingURL=chimClient.js.map