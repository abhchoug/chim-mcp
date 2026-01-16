export type ChimConfig = {
    /**
     * Base URL for the CHIM API. Defaults to stage.
     */
    baseUrl: string;
    /**
     * API key used for authenticated requests.
     */
    apiKey?: string;
    /**
     * User agent string sent to CHIM for observability.
     */
    userAgent: string;
};
export declare const DEFAULT_BASE_URL = "https://api.chim.umbrella.com";
export declare const DEFAULT_USER_AGENT = "chim-mcp/0.1.0";
type StoredConfig = {
    baseUrl?: string;
    userAgent?: string;
    apiKey?: string;
};
export declare function loadConfig(): ChimConfig;
export declare function ensureApiKey(config: ChimConfig): string;
export declare function saveUserConfig(update: StoredConfig): Promise<void>;
export declare function getUserConfigPath(): string;
export {};
//# sourceMappingURL=config.d.ts.map