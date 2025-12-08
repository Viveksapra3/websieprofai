# ProfAICoach Production Setup Script (PowerShell)
# This script helps configure the frontend for production deployment

Write-Host "🚀 ProfAICoach Production Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production.local exists
if (Test-Path ".env.production.local") {
    Write-Host "⚠️  .env.production.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Prompt for EC2 IP or domain
Write-Host "📡 Backend Configuration" -ForegroundColor Green
Write-Host "------------------------" -ForegroundColor Green
$EC2_HOST = Read-Host "Enter your EC2 IP address or domain (e.g., 51.20.109.241)"
$BACKEND_PORT = Read-Host "Enter backend port (default: 5001)"
if ([string]::IsNullOrWhiteSpace($BACKEND_PORT)) {
    $BACKEND_PORT = "5001"
}

# Prompt for frontend domain
Write-Host ""
Write-Host "🌐 Frontend Configuration" -ForegroundColor Green
Write-Host "-------------------------" -ForegroundColor Green
$FRONTEND_DOMAIN = Read-Host "Enter your frontend domain (e.g., https://yourdomain.com)"

# Prompt for Firebase config
Write-Host ""
Write-Host "🔥 Firebase Configuration" -ForegroundColor Green
Write-Host "-------------------------" -ForegroundColor Green
$FIREBASE_API_KEY = Read-Host "Firebase API Key"
$FIREBASE_AUTH_DOMAIN = Read-Host "Firebase Auth Domain"
$FIREBASE_PROJECT_ID = Read-Host "Firebase Project ID"
$FIREBASE_STORAGE_BUCKET = Read-Host "Firebase Storage Bucket"
$FIREBASE_MESSAGING_SENDER_ID = Read-Host "Firebase Messaging Sender ID"
$FIREBASE_APP_ID = Read-Host "Firebase App ID"
$FIREBASE_MEASUREMENT_ID = Read-Host "Firebase Measurement ID (optional)"

# Determine protocol (http/https)
if ($FRONTEND_DOMAIN -like "https://*") {
    $BACKEND_PROTOCOL = "https"
    $WS_PROTOCOL = "wss"
} else {
    $BACKEND_PROTOCOL = "http"
    $WS_PROTOCOL = "ws"
}

# Create .env.production.local
$envContent = @"
# =============================================================================
# ProfAICoach Production Environment
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
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
"@

$envContent | Out-File -FilePath ".env.production.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Production environment file created: .env.production.local" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan
Write-Host "Backend URL: ${BACKEND_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}"
Write-Host "WebSocket URL: ${WS_PROTOCOL}://${EC2_HOST}:${BACKEND_PORT}"
Write-Host "Frontend Domain: ${FRONTEND_DOMAIN}"
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review .env.production.local and make any necessary adjustments"
Write-Host "2. Ensure your EC2 backend is running and accessible"
Write-Host "3. Update backend ALLOWED_ORIGINS to include: ${FRONTEND_DOMAIN}"
Write-Host "4. Run 'npm run build' to create production build"
Write-Host "5. Deploy the dist/public folder to your hosting platform"
Write-Host ""
Write-Host "📖 For detailed deployment instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
