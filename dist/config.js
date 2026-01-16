import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
export const DEFAULT_BASE_URL = 'https://api.chim.umbrella.com';
export const DEFAULT_USER_AGENT = 'chim-mcp/0.1.0';
const CONFIG_DIR = path.join(os.homedir(), '.config', 'chim-mcp');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
export function loadConfig() {
    const storedConfig = readUserConfigSync();
    const baseUrl = process.env.CHIM_API_BASE_URL?.trim() ||
        storedConfig?.baseUrl ||
        DEFAULT_BASE_URL;
    const userAgent = process.env.CHIM_API_USER_AGENT?.trim() ||
        storedConfig?.userAgent ||
        DEFAULT_USER_AGENT;
    const apiKey = process.env.CHIM_API_KEY?.trim() || storedConfig?.apiKey;
    const config = {
        baseUrl,
        userAgent
    };
    if (apiKey) {
        config.apiKey = apiKey;
    }
    return config;
}
export function ensureApiKey(config) {
    if (!config.apiKey) {
        throw new Error('Missing CHIM_API_KEY environment variable. Create an API key in CHIM and export it before calling authenticated tools.');
    }
    return config.apiKey;
}
export async function saveUserConfig(update) {
    const current = readUserConfigSync() ?? {};
    const nextConfig = {
        ...current,
        ...pruneUndefined(update)
    };
    await fs.promises.mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 });
    await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(nextConfig, null, 2), { mode: 0o600 });
}
export function getUserConfigPath() {
    return CONFIG_PATH;
}
function readUserConfigSync() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }
        return {
            baseUrl: typeof parsed.baseUrl === 'string' ? parsed.baseUrl : undefined,
            userAgent: typeof parsed.userAgent === 'string' ? parsed.userAgent : undefined,
            apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : undefined
        };
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}
function pruneUndefined(input) {
    const entries = Object.entries(input).filter(([, value]) => value !== undefined);
    return Object.fromEntries(entries);
}
//# sourceMappingURL=config.js.map