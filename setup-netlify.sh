#!/bin/bash

# Setup script for Netlify deployment
# This script helps configure the project for Netlify deployment

set -e

echo "🚀 El Sabor Colombiano - Netlify Setup"
echo "========================================"
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    exit 1
fi

echo "✅ Project structure validated"
echo ""

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed"
else
    echo "✅ Netlify CLI already installed"
fi
echo ""

# Prompt for backend URL
echo "🔧 Configuration"
echo "---------------"
echo ""
read -p "Enter your backend URL (e.g., https://your-app.up.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required"
    exit 1
fi

# Remove trailing slash if present
BACKEND_URL=${BACKEND_URL%/}

echo ""
echo "Backend URL: $BACKEND_URL"
echo "API URL: $BACKEND_URL/api"
echo ""

# Create or update .env.production for frontend
cat > frontend/.env.production << EOF
# Production API Configuration for Netlify
VITE_API_URL=$BACKEND_URL/api
VITE_SOCKET_URL=$BACKEND_URL
EOF

echo "✅ Created frontend/.env.production"
echo ""

# Test if we can build the frontend
echo "🔨 Testing frontend build..."
cd frontend
npm install --silent
npm run build
cd ..
echo "✅ Frontend build successful"
echo ""

# Prompt for Netlify setup
echo "🌐 Netlify Setup"
echo "---------------"
echo ""
echo "Options:"
echo "1. Initialize new Netlify site"
echo "2. Link to existing Netlify site"
echo "3. Skip (I'll configure manually)"
echo ""
read -p "Choose an option (1-3): " NETLIFY_OPTION

case $NETLIFY_OPTION in
    1)
        echo ""
        echo "Initializing new Netlify site..."
        netlify init
        ;;
    2)
        echo ""
        echo "Linking to existing site..."
        netlify link
        ;;
    3)
        echo ""
        echo "Skipping automatic Netlify configuration"
        echo ""
        echo "📝 Manual steps:"
        echo "1. Go to https://app.netlify.com"
        echo "2. Click 'Add new site' → 'Import an existing project'"
        echo "3. Connect your GitHub repository"
        echo "4. Configure build settings:"
        echo "   - Base directory: frontend"
        echo "   - Build command: npm run build"
        echo "   - Publish directory: frontend/dist"
        echo "5. Add environment variables:"
        echo "   - VITE_API_URL=$BACKEND_URL/api"
        echo "   - VITE_SOCKET_URL=$BACKEND_URL"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Ensure your backend at $BACKEND_URL is running"
echo "2. Update FRONTEND_URL in your backend to include your Netlify URL"
echo "3. Push your changes to GitHub"
echo "4. Your site will be deployed automatically"
echo ""
echo "📚 Documentation:"
echo "- Quick Start: NETLIFY_QUICK_START.md"
echo "- Full Guide: NETLIFY_DEPLOYMENT.md"
echo "- Comparison: DEPLOYMENT_COMPARISON.md"
echo ""
echo "🆘 Need help? Open an issue on GitHub"
