#!/bin/bash

# ScriptCraft Quick Setup Script
# For Muhammad Usman (muhmdusman)

echo "🚀 ScriptCraft Quick Setup"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

echo "✓ Project directory confirmed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial ScriptCraft commercial version"
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi
echo ""

# Check for GitHub CLI
if command -v gh &> /dev/null; then
    echo "🐙 GitHub CLI found. Do you want to create a GitHub repository?"
    echo "   Repository: muhmdusman/scriptcraft"
    read -p "   Create now? (y/n): " create_repo
    
    if [ "$create_repo" = "y" ]; then
        gh repo create muhmdusman/scriptcraft --public --source=. --remote=origin --push
        echo "✓ GitHub repository created and pushed"
    fi
else
    echo "ℹ️  GitHub CLI not found. To push to GitHub:"
    echo "   1. Create repository at: https://github.com/new"
    echo "   2. Name it: scriptcraft"
    echo "   3. Run these commands:"
    echo ""
    echo "      git remote add origin https://github.com/muhmdusman/scriptcraft.git"
    echo "      git branch -M main"
    echo "      git push -u origin main"
fi
echo ""

# Test local server
echo "🌐 Testing local server..."
echo "   Starting server on http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""
echo "   Once the server starts, open http://localhost:3000 in your browser"
echo "   to test the application."
echo ""

npm run dev
