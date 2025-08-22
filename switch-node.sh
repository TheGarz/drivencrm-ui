#!/bin/bash

echo "🔧 Switching to Node.js 22.18.0 for CRMV2-UI development"
echo "=================================================="

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Display current version
echo "Current Node.js version: $(node --version)"

# Switch to Node.js 22.18.0
echo "Switching to Node.js 22.18.0..."
nvm use 22.18.0

# Verify the switch
echo "New Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Set as default for future sessions
nvm alias default 22.18.0

echo ""
echo "✅ Node.js upgraded successfully!"
echo ""
echo "Now you can run:"
echo "  npm install --legacy-peer-deps"
echo "  npm run dev"
echo ""