# CHIM MCP Installation Guide

This guide covers all ways to install and use the CHIM MCP server.

---

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **CHIM API Key** - Generate one from the CHIM UI

---

## Installation Methods

### 1️⃣ VS Code + GitHub Copilot (Easiest)

#### Method A: VS Code Configuration (Recommended for Now)

1. **Clone the repository locally:**
   ```bash
   git clone https://github.com/abhchoug/chim-mcp.git
   cd chim-mcp
   npm install
   npm run build
   ```

2. **Add to VS Code MCP config:**
   - Open VS Code settings: `Ctrl+Shift+P` → "Preferences: Open Settings (JSON)"
   - Or edit: `~/Library/Application Support/Code/User/mcp.json` (macOS) or `%APPDATA%\Code\User\mcp.json` (Windows)
   - Add this server configuration:

   ```json
   {
     "servers": {
       "chim": {
         "type": "stdio",
         "command": "node",
         "args": ["/full/path/to/chim-mcp/dist/server.js"]
       }
     }
   }
   ```

   **Replace `/full/path/to/chim-mcp` with your actual path**, e.g.:
   - macOS: `/Users/username/work/chim-mcp`
   - Linux: `/home/username/chim-mcp`
   - Windows: `C:\\Users\\username\\chim-mcp`

3. **Reload VS Code:**
   - Press `Ctrl+Shift+P` → "Developer: Reload Window"

4. **Save your CHIM API key** (pick one):
   - **Option A (GUI):** Ask Copilot: *"Save my CHIM API key: `YOUR_KEY`"*
   - **Option B (Manual):** Create/edit `~/.config/chim-mcp/config.json`:
     ```json
     {
       "apiKey": "YOUR_API_KEY"
     }
     ```
   - **Option C (Environment):** `export CHIM_API_KEY=YOUR_API_KEY`

5. ✅ **Done!** Try asking Copilot: *"List my CHIM changes"*

---

### 2️⃣ Claude Desktop

1. **Clone and build locally:**
   ```bash
   git clone https://github.com/abhchoug/chim-mcp.git
   cd chim-mcp
   npm install
   npm run build
   ```

2. **Edit Claude Desktop config:**
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

   Add this:
   ```json
   {
     "mcpServers": {
       "chim": {
         "command": "node",
         "args": ["/full/path/to/chim-mcp/dist/server.js"]
       }
     }
   }
   ```

3. **Save API key** (same as VS Code, Option A-C above)

4. **Restart Claude Desktop completely** (quit and reopen)

5. ✅ **Done!** Try: *"List my CHIM changes"*

---

### 3️⃣ Command Line (Standalone)

Run the server directly:

```bash
# Clone and build
git clone https://github.com/abhchoug/chim-mcp.git
cd chim-mcp
npm install
npm run build

# Set API key
export CHIM_API_KEY=your-api-key-here

# Start the server
node dist/server.js
```

The server will listen for MCP protocol messages on stdin/stdout.

---

### 4️⃣ Global npm Install (Future)

Once published to npm, users can:

```bash
npm install -g chim-mcp
```

Then use in MCP configs:
```json
{
  "command": "chim-mcp"
}
```

---

## 🔑 Setting Your API Key

Choose **one** method:

### Method 1: Configuration File (Recommended)
```bash
# Create config directory
mkdir -p ~/.config/chim-mcp

# Create config file
cat > ~/.config/chim-mcp/config.json << EOF
{
  "apiKey": "YOUR_API_KEY",
  "baseUrl": "https://api.chim.umbrella.com"
}
EOF
```

### Method 2: Environment Variable
```bash
export CHIM_API_KEY=YOUR_API_KEY
```

### Method 3: Via Copilot (VS Code/Claude)
Ask your assistant: _"Save my CHIM API key: `YOUR_API_KEY`"_

---

## 🛠️ Configuration Options

| Setting | Env Var | Config File | Default |
|---------|---------|-------------|---------|
| API Key | `CHIM_API_KEY` | `apiKey` | _(required)_ |
| API Base URL | `CHIM_API_BASE_URL` | `baseUrl` | `https://api.chim.umbrella.com` |
| User Agent | `CHIM_API_USER_AGENT` | `userAgent` | `chim-mcp/0.1.0` |

**For CHIM Staging:**
```json
{
  "apiKey": "YOUR_API_KEY",
  "baseUrl": "https://api.stage.chim.umbrella.com"
}
```

---

## ✅ Available Tools

Once configured, you can use these tools:

| Tool | Description |
|------|-------------|
| `chim_list_changes` | List change notifications |
| `chim_list_outages` | List incident/outage notifications |
| `chim_list_retros` | List retrospectives |
| `chim_create_change` | Create a change notification |
| `chim_create_outage` | Create an incident/outage |
| `chim_get_change_freeze_status` | Check change freeze status |
| `chim_save_api_key` | Save API key via Copilot |

### Example Prompts

```
"List my recent CHIM changes"
"What outages are currently reported?"
"Check if there's a change freeze"
"Create a change notification for my deployment"
```

---

## 🐛 Troubleshooting

### Issue: "Server failed to start" or "Command not found"

**Solution:**
- Verify Node.js is installed: `node --version` (should be ≥18.0.0)
- Verify full path in MCP config is correct
- Try absolute path: `/Users/username/work/chim-mcp/dist/server.js` (not `~/...`)

### Issue: "API key not found" or "Unauthorized"

**Solution:**
- Check config file exists: `cat ~/.config/chim-mcp/config.json`
- Check environment: `echo $CHIM_API_KEY`
- Regenerate API key in CHIM UI and reconfigure
- Restart the application after setting API key

### Issue: "No such file or directory: dist/server.js"

**Solution:**
```bash
cd /path/to/chim-mcp
npm install
npm run build
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
cd /path/to/chim-mcp
npm install --save-dev
npm run build
```

---

## 📖 Additional Resources

- **CHIM API Documentation**: See [docs/cloudsec/docs/CHIM/api/](docs/cloudsec/docs/CHIM/api/)
- **MCP Protocol**: https://modelcontextprotocol.io/
- **GitHub Repository**: https://github.com/abhchoug/chim-mcp

---

## 🤝 Contributing

Want to extend CHIM MCP? See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📝 License

MIT License - See [LICENSE](LICENSE)
