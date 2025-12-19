# PostgreSQL Database Backup Script
# This script creates a backup of the prof_AI database

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "database-backups"
$backupFile = "$backupDir\prof_AI_backup_$timestamp.sql"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Created backup directory: $backupDir"
}

# Database connection details
$env:PGPASSWORD = "npg_w7CpzBjX0afO"
$dbHost = "ep-still-cake-adz101ej-pooler.c-2.us-east-1.aws.neon.tech"
$dbName = "prof_AI"
$dbUser = "Vivek"
$dbPort = "5432"

Write-Host "Starting database backup..."
Write-Host "Database: $dbName"
Write-Host "Host: $dbHost"
Write-Host "Backup file: $backupFile"
Write-Host ""

# Execute pg_dump
pg_dump -h $dbHost -p $dbPort -U $dbUser -d $dbName -F p -f $backupFile

if ($LASTEXITCODE -eq 0) {
    $fileSize = (Get-Item $backupFile).Length / 1MB
    Write-Host ""
    Write-Host "Backup completed successfully!" -ForegroundColor Green
    Write-Host "File: $backupFile" -ForegroundColor Green
    Write-Host "Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Backup failed!" -ForegroundColor Red
    Write-Host "Please ensure pg_dump is installed and accessible in PATH" -ForegroundColor Yellow
}

# Clear password from environment
Remove-Item Env:\PGPASSWORD
