#!/bin/bash

# ProfAICoach Production Setup Script
# This script helps configure the frontend for production deployment

set -e

echo "🚀 ProfAICoach Production Setup"
echo "================================"
echo ""

# Check if .env.production.local exists
if [ -f ".env.production.local" ]; then
    echo "⚠️  .env.production.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Prompt for EC2 IP or domain
echo "📡 Backend Configuration"
echo "------------------------"
read -p "Enter your EC2 IP address or domain (e.g., 51.20.109.241): " EC2_HOST
read -p "Enter backend port (default: 5001): " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-5001}

# Prompt for frontend domain
echo ""
echo "🌐 Frontend Configuration"
echo "-------------------------"
read -p "Enter your frontend domain (e.g., https://yourdomain.com): " FRONTEND_DOMAIN

# Prompt for Firebase config
echo ""
echo "🔥 Firebase Configuration"
echo "-------------------------"
read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID
read -p "Firebase Measurement ID (optional): " FIREBASE_MEASUREMENT_ID

# Determine protocol (http/https)
if [[ $FRONTEND_DOMAIN == https://* ]]; then
    BACKEND_PROTOCOL="https"
    WS_PROTOCOL="wss"
else
    BACKEND_PROTOCOL="http"
    WS_PROTOCOL="ws"
fi

# Create .env.production.local
cat > .env.production.local << EOF
# =============================================================================
# ProfAICoach Production Environment
# Generated on $(date)
# =============================================================================

# Backend API Configuration
VITE_API_BASE=${BACKEND_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}
VITE_API_URL=${WS_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}
VITE_AVI_URL=${BACKEND_PROTOCOL}://${EC2_HOST}:3002

# Frontend Configuration
VITE_AUTH_REDIRECT_URL=${FRONTEND_DOMAIN}/auth/callback

# Firebase Configuration
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${FIREBASE_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}
EOF

echo ""
echo "✅ Production environment file created: .env.production.local"
echo ""
echo "📋 Configuration Summary:"
echo "------------------------"
echo "Backend URL: ${BACKEND_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}"
echo "WebSocket URL: ${WS_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}"
echo "Frontend Domain: ${FRONTEND_DOMAIN}"
echo ""
echo "🔧 Next Steps:"
echo "1. Review .env.production.local and make any necessary adjustments"
echo "2. Ensure your EC2 backend is running and accessible"
echo "3. Update backend ALLOWED_ORIGINS to include: ${FRONTEND_DOMAIN}"
echo "4. Run 'npm run build' to create production build"
echo "5. Deploy the dist/public folder to your hosting platform"
echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"
echo ""
