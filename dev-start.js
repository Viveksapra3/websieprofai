// Quick development starter script
// This helps bypass database issues for immediate development

const fs = require('fs');
const path = require('path');

// Create a minimal .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Minimal development configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/temp
SESSION_SECRET=dev-secret-change-me-in-production
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created minimal .env file');
}

console.log('🚀 Starting development server...');
console.log('📝 Note: You may see database connection errors - this is expected without a proper database setup');
console.log('📖 Check SETUP.md for complete database setup instructions');

// Start the development server
require('child_process').spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});
