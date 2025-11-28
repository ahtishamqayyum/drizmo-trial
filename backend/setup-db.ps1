# Database Setup Script
# This script will run migrations and seed the database

Write-Host "🔧 Setting up database..." -ForegroundColor Cyan

# Run migrations
Write-Host "📦 Running migrations..." -ForegroundColor Yellow
npm run prisma:migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migrations failed!" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host "🔨 Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma Client generation failed!" -ForegroundColor Red
    exit 1
}

# Run seed
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npm run prisma:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Seeding failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Test Users:" -ForegroundColor Cyan
Write-Host "  Tenant A: userA@test.com / password123" -ForegroundColor White
Write-Host "  Tenant B: userB@test.com / password123" -ForegroundColor White

