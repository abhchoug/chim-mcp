# CHIM MCP - Quick Reference

## 🎯 What is This?

CHIM MCP is a tool that lets you use CHIM (change management) directly from your AI assistant:
- **VS Code Copilot** - Ask questions inside VS Code
- **Claude Desktop** - Use in Claude conversations  
- **Any MCP Client** - Works with REST or stdio-based clients

## ⚡ Installation (Pick One)

### 📍 VS Code Users
```bash
# 1. Clone and build
git clone https://github.com/abhchoug/chim-mcp.git
cd chim-mcp && npm install && npm run build

# 2. Add to MCP config
cat >> ~/Library/Application\ Support/Code/User/mcp.json << 'EOF'
,
  "chim": {
    "type": "stdio",
    "command": "node",
    "args": ["/full/path/to/chim-mcp/dist/server.js"]
  }
EOF

# 3. Set API key
echo '{"apiKey":"YOUR_API_KEY"}' > ~/.config/chim-mcp/config.json

# 4. Reload VS Code (Ctrl+Shift+P → Developer: Reload Window)
```

### 📍 Claude Desktop Users
```bash
# 1. Clone and build
git clone https://github.com/abhchoug/chim-mcp.git
cd chim-mcp && npm install && npm run build

# 2. Edit Claude config
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Add:
{
  "mcpServers": {
    "chim": {
      "command": "node",
      "args": ["/full/path/to/chim-mcp/dist/server.js"]
    }
  }
}

# 3. Set API key (same as above)
echo '{"apiKey":"YOUR_API_KEY"}' > ~/.config/chim-mcp/config.json

# 4. Restart Claude Desktop completely
```

## 🔧 Configuration

### Set Your API Key (Pick One)

**Option 1: Config File** (Recommended)
```bash
mkdir -p ~/.config/chim-mcp
cat > ~/.config/chim-mcp/config.json << EOF
{
  "apiKey": "YOUR_API_KEY",
  "baseUrl": "https://api.chim.umbrella.com"
}
EOF
```

**Option 2: Environment Variable**
```bash
export CHIM_API_KEY=YOUR_API_KEY
```

**Option 3: Ask Your AI Assistant**
In VS Code or Claude: *"Save my CHIM API key: YOUR_API_KEY"*

### Use Staging (Optional)
```json
{
  "apiKey": "YOUR_API_KEY",
  "baseUrl": "https://api.stage.chim.umbrella.com"
}
```

## 💬 Example Prompts

Try these in your AI assistant:

```
"List my recent changes"
"What outages are currently reported?"
"Check the change freeze status"
"Create a change notification for deployment XYZ"
"List retrospectives from the last month"
```

## 🛠️ Available Tools

| Tool | What It Does |
|------|--------------|
| `chim_list_changes` | See all change notifications |
| `chim_list_outages` | See all active outages |
| `chim_list_retros` | See retrospectives |
| `chim_create_change` | Create a new change |
| `chim_create_outage` | Report an incident |
| `chim_get_change_freeze_status` | Check if there's a freeze |
| `chim_save_api_key` | Update API key from chat |

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Server failed to start" | Make sure Node.js 18+ is installed: `node --version` |
| "API key not found" | Run API key setup command above and restart |
| "Cannot find module" | Run: `cd chim-mcp && npm install && npm run build` |
| "Command not found" | Use **absolute path** in MCP config (not `~/...`) |

## 📚 Full Documentation

- **Installation Guide**: See [INSTALL.md](INSTALL.md)
- **Troubleshooting**: See [INSTALL.md#troubleshooting](INSTALL.md#-troubleshooting)
- **GitHub**: https://github.com/abhchoug/chim-mcp

---

**Need help?** Check [INSTALL.md](INSTALL.md) for complete setup instructions!
