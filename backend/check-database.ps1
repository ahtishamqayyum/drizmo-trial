# Database Check Script
# This script checks if database has data and shows what's in it

Write-Host ""
Write-Host "Checking Database..." -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "[ERROR] .env file not found!" -ForegroundColor Red
    Write-Host "Please run setup first or create .env file" -ForegroundColor Yellow
    exit 1
}

# Check DATABASE_URL
$envLines = Get-Content .env
$databaseUrl = $envLines | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1

if (-not $databaseUrl) {
    Write-Host "[ERROR] DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

# Extract DATABASE_URL value (remove DATABASE_URL= and quotes)
$databaseUrl = $databaseUrl -replace '^DATABASE_URL=', '' -replace '^"', '' -replace '"$', ''

if ($databaseUrl -match 'your_password') {
    Write-Host "[ERROR] DATABASE_URL contains placeholder password!" -ForegroundColor Red
    Write-Host "Please update DATABASE_URL in .env file" -ForegroundColor Yellow
    exit 1
}

# Extract database connection details
if ($databaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)') {
    $dbUser = $matches[1]
    $dbPassword = $matches[2]
    $dbHost = $matches[3]
    $dbPort = $matches[4]
    $dbName = $matches[5]
    
    Write-Host "Database Info:" -ForegroundColor Yellow
    Write-Host "   Host: $dbHost" -ForegroundColor Gray
    Write-Host "   Port: $dbPort" -ForegroundColor Gray
    Write-Host "   Database: $dbName" -ForegroundColor Gray
    Write-Host "   User: $dbUser" -ForegroundColor Gray
    Write-Host ""
    
    # Check if psql is available
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if ($psqlPath) {
        Write-Host "Checking database tables and data..." -ForegroundColor Yellow
        Write-Host ""
        
        # Set PGPASSWORD for psql
        $env:PGPASSWORD = $dbPassword
        
        # Check tenants table
        Write-Host "Tenants Table:" -ForegroundColor Cyan
        $tenants = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -tAc "SELECT COUNT(*) FROM tenants;" 2>$null
        if ($tenants) {
            Write-Host "   Total Tenants: $tenants" -ForegroundColor Green
            psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT id, name, created_at FROM tenants ORDER BY created_at;" 2>$null
        } else {
            Write-Host "   [WARNING] No tenants found or table doesn't exist" -ForegroundColor Yellow
        }
        Write-Host ""
        
        # Check users table
        Write-Host "Users Table:" -ForegroundColor Cyan
        $users = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -tAc "SELECT COUNT(*) FROM users;" 2>$null
        if ($users) {
            Write-Host "   Total Users: $users" -ForegroundColor Green
            psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT id, email, role, tenant_id, created_at FROM users ORDER BY created_at;" 2>$null
        } else {
            Write-Host "   [WARNING] No users found or table doesn't exist" -ForegroundColor Yellow
        }
        Write-Host ""
        
        # Check templates table
        Write-Host "Templates Table:" -ForegroundColor Cyan
        $templates = psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -tAc "SELECT COUNT(*) FROM templates;" 2>$null
        if ($templates) {
            Write-Host "   Total Templates: $templates" -ForegroundColor Green
            psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -c "SELECT id, title, tenant_id, user_id, created_at FROM templates ORDER BY created_at;" 2>$null
        } else {
            Write-Host "   [WARNING] No templates found or table doesn't exist" -ForegroundColor Yellow
        }
        Write-Host ""
        
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
        
        Write-Host "To view data in pgAdmin:" -ForegroundColor Cyan
        Write-Host "   1. Open pgAdmin" -ForegroundColor White
        $serverInfo = "${dbHost}:${dbPort}"
        Write-Host "   2. Connect to server: $serverInfo" -ForegroundColor White
        Write-Host "   3. Navigate to: Databases > $dbName > Schemas > public > Tables" -ForegroundColor White
        Write-Host "   4. Right-click on table > View/Edit Data > All Rows" -ForegroundColor White
        Write-Host ""
        
    } else {
        Write-Host "[WARNING] psql command not found. Cannot check database directly." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To check data in pgAdmin:" -ForegroundColor Cyan
        Write-Host "   1. Open pgAdmin" -ForegroundColor White
        Write-Host "   2. Connect to PostgreSQL server" -ForegroundColor White
        Write-Host "   3. Navigate to: Databases > $dbName > Schemas > public > Tables" -ForegroundColor White
        Write-Host "   4. Right-click on table > View/Edit Data > All Rows" -ForegroundColor White
        Write-Host ""
        Write-Host "   Or run seed script to populate data:" -ForegroundColor Yellow
        Write-Host "   npm run prisma:seed" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "[ERROR] Could not parse DATABASE_URL from .env file" -ForegroundColor Red
    exit 1
}

# Check if Prisma Client can connect using a separate script file
Write-Host "Testing Prisma connection..." -ForegroundColor Yellow

# Check if Prisma Client is generated
$prismaClientPath = Join-Path $PSScriptRoot "node_modules\.prisma\client"
if (-not (Test-Path $prismaClientPath)) {
    Write-Host "[WARNING] Prisma Client not generated. Generating now..." -ForegroundColor Yellow
    $currentDir = Get-Location
    Set-Location $PSScriptRoot
    npm run prisma:generate 2>&1 | Out-Null
    Set-Location $currentDir
    Write-Host ""
}

# Create script in backend directory so node_modules can be found
$tempScriptPath = Join-Path $PSScriptRoot "temp-prisma-check-$(Get-Random).js"
$jsLines = @(
    'const { PrismaClient } = require("@prisma/client");',
    'const prisma = new PrismaClient();',
    'prisma.tenant.count()',
    '  .then(count => {',
    '    console.log("[OK] Prisma connected! Tenants:", count);',
    '    return prisma.user.count();',
    '  })',
    '  .then(count => {',
    '    console.log("[OK] Users:", count);',
    '    return prisma.template.count();',
    '  })',
    '  .then(count => {',
    '    console.log("[OK] Templates:", count);',
    '    prisma.$disconnect();',
    '  })',
    '  .catch(err => {',
    '    console.error("[ERROR] Prisma error:", err.message);',
    '    process.exit(1);',
    '  });'
)

try {
    $jsLines | Out-File -FilePath $tempScriptPath -Encoding UTF8
    # Run node from the backend directory where node_modules exists
    $currentDir = Get-Location
    Set-Location $PSScriptRoot
    $nodeOutput = node $tempScriptPath 2>&1
    $exitCode = $LASTEXITCODE
    Set-Location $currentDir
    
    Write-Host $nodeOutput
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "[SUCCESS] Database connection successful!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "[ERROR] Database connection failed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "  1. PostgreSQL is running" -ForegroundColor Gray
        Write-Host "  2. DATABASE_URL is correct in .env file" -ForegroundColor Gray
        Write-Host "  3. Database '$dbName' exists" -ForegroundColor Gray
        Write-Host "  4. Run migrations: npm run prisma:migrate" -ForegroundColor Gray
        Write-Host "  5. Run seed: npm run prisma:seed" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ERROR] Error running Prisma check: $_" -ForegroundColor Red
} finally {
    # Clean up temp file
    if (Test-Path $tempScriptPath) {
        Remove-Item $tempScriptPath -ErrorAction SilentlyContinue
    }
}

Write-Host ""
