#!/bin/bash
# Install CHIM MCP server for VS Code
# Usage: curl -fsSL https://raw.githubusercontent.com/abhchoug/chim-mcp/main/scripts/install-vscode.sh | bash

set -e

echo "🔧 Installing CHIM MCP for VS Code..."

# Detect VS Code settings path
if [[ "$OSTYPE" == "darwin"* ]]; then
    SETTINGS_DIR="$HOME/Library/Application Support/Code/User"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    SETTINGS_DIR="$HOME/.config/Code/User"
else
    echo "❌ Unsupported OS. Please install manually."
    echo "   See: https://github.com/abhchoug/chim-mcp#readme"
    exit 1
fi

SETTINGS_FILE="$SETTINGS_DIR/settings.json"

# Create settings dir if it doesn't exist
mkdir -p "$SETTINGS_DIR"

# Check if settings.json exists
if [ ! -f "$SETTINGS_FILE" ]; then
    echo "{}" > "$SETTINGS_FILE"
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq not found. Creating manual instructions..."
    echo ""
    echo "Add this to your VS Code Settings (JSON):"
    echo ""
    cat << 'EOF'
{
  "mcp": {
    "servers": {
      "chim": {
        "type": "stdio",
        "command": "npx",
        "args": ["-y", "@cisco-sbg/chim-mcp"]
      }
    }
  }
}
EOF
    echo ""
    echo "Or create .vscode/mcp.json in your workspace with the servers config."
    exit 0
fi

# Add MCP config using jq
TEMP_FILE=$(mktemp)
jq '.mcp.servers.chim = {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@cisco-sbg/chim-mcp"]
}' "$SETTINGS_FILE" > "$TEMP_FILE" && mv "$TEMP_FILE" "$SETTINGS_FILE"

echo "✅ CHIM MCP added to VS Code settings!"
echo ""
echo "Next steps:"
echo "  1. Restart VS Code"
echo "  2. Set your API key:"
echo "     - Ask Copilot: \"Save my CHIM API key: YOUR_KEY\""
echo "     - Or: export CHIM_API_KEY=your-key"
echo "     - Or: echo '{\"apiKey\": \"your-key\"}' > ~/.config/chim-mcp/config.json"
echo ""
echo "  3. Try it: \"List my CHIM changes\""
echo ""
echo "📚 Docs: https://github.com/abhchoug/chim-mcp"
