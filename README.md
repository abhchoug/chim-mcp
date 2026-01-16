# CHIM MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes CHIM change-management workflows (changes, outages, retros, and change freeze status) as MCP tools. Register this server with VS Code Copilot, Claude Desktop, or any MCP-compatible agent to query or update CHIM directly from your AI assistant.

## 🚀 Quick Install

### VS Code / GitHub Copilot (Recommended)

1. Open VS Code Settings (JSON) or create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "chim": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@cisco-sbg/chim-mcp"]
    }
  }
}
```

2. Set your API key using one of these methods:
   - Run the `chim_save_api_key` tool from Copilot Chat
   - Set `CHIM_API_KEY` environment variable
   - Create `~/.config/chim-mcp/config.json` with `{"apiKey": "your-key"}`

3. Restart VS Code and start using CHIM tools in Copilot Chat!

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "chim": {
      "command": "npx",
      "args": ["-y", "@cisco-sbg/chim-mcp"]
    }
  }
}
```

### Global CLI Install

```bash
npm install -g @cisco-sbg/chim-mcp
chim-mcp  # runs the server
```

## Prerequisites

- Node.js 18+ (the server relies on the global `fetch` implementation)
- A CHIM API key - generate one in the CHIM UI following the [API key guide](docs/cloudsec/docs/CHIM/api/managing_keys.md)

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `CHIM_API_KEY` | _(required)_ | API key sent as `Authorization: Api-Key …`. |
| `CHIM_API_BASE_URL` | `https://api.chim.umbrella.com` | Base URL for the CHIM API (set to `https://api.stage.chim.umbrella.com` for stage). |
| `CHIM_API_USER_AGENT` | `chim-mcp/0.1.0` | Overrides the `User-Agent` header if you need to identify your automation. |

You can also store configuration in `~/.config/chim-mcp/config.json`:

```json
{
  "apiKey": "your-key",
  "baseUrl": "https://api.chim.umbrella.com",
  "userAgent": "chim-mcp/0.1.0"
}
```

Environment variables take precedence over the user-level config file.

## Development

```bash
git clone https://github.com/cisco-sbg/chim-mcp.git
cd chim-mcp
npm install

# Run in development mode (TypeScript directly)
npm run dev

# Build and run production
npm run build
npm start
```

## Available tools

| Tool | Endpoint | Purpose |
| --- | --- | --- |
| `chim_save_api_key` | _local_ | Stores the API key and optional overrides in `~/.config/chim-mcp/config.json`. |
| `chim_get_change_freeze_status` | `GET /api/status/` | Returns the global and per-suite change-freeze status documented in `api_status.md`. |
| `chim_list_changes` | `GET /api/v1/changes/` | Lists change notifications (supports `page`, `page_size`, and `search` query params). |
| `chim_create_change` | `POST /api/v1/changes/` | Creates a change notification. Pass the request body defined in `guide.md` inside the `payload` argument. |
| `chim_list_outages` | `GET /api/v1/outages/` | Lists incidents/outages (same pagination parameters as `/changes/`). |
| `chim_create_outage` | `POST /api/v1/outages/` | Creates an outage notification using the payload described in the guide. |
| `chim_list_retros` | `GET /api/v1/retros/` | Lists retrospective reports for completed incidents/changes. |

The create tools accept either:

- `payload` as a raw JSON string, or
- `payload` as a structured object (when the calling agent supports complex tool arguments).

Set `dry_run: true` to have the server validate/echo the payload without sending it to CHIM—handy while drafting.

## Testing

### Unit Tests

Run the test suite with:

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Manual Testing with JSON-RPC

You can test the server manually by piping JSON-RPC messages:

```bash
# List tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm run dev

# Call a tool (e.g., list changes with search)
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"chim_list_changes","arguments":{"search":"your-username"}}}' | npm run dev
```

## Extending the interface

1. Review the upstream docs and schema links inside `docs/cloudsec/docs/CHIM/api/**`. The OpenAPI description is linked in `overview.md`.
2. Add a helper in `src/server.ts` that calls the desired CHIM endpoint using the shared `ChimClient`.
3. Register a new tool with a `zod` schema to keep inputs validated.
4. Re-run `npm run build` so the emitted JS in `dist/` stays in sync.

The project keeps the MCP implementation small and framework-free, so adding additional CHIM endpoints (pagerduty helpers, key management, etc.) only requires a few lines per tool.

## Publishing

To publish a new version:

```bash
npm version patch  # or minor/major
npm publish --access public
```

## License

MIT
