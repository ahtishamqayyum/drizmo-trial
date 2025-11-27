# Backend Server Start Script
Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path env-template.txt) {
        Copy-Item env-template.txt .env
        Write-Host ".env file created. Please update DATABASE_URL with your PostgreSQL credentials." -ForegroundColor Yellow
    }
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting server on http://localhost:3001..." -ForegroundColor Cyan
npm run start:dev

