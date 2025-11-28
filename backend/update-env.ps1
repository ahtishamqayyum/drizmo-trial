# Helper script to update .env file with PostgreSQL password
param(
    [Parameter(Mandatory=$true)]
    [string]$Password
)

$envFile = ".env"
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    $content = $content -replace 'postgresql://postgres:your_password@', "postgresql://postgres:$Password@"
    $content = $content -replace 'postgresql://postgres:YOUR_PASSWORD@', "postgresql://postgres:$Password@"
    Set-Content -Path $envFile -Value $content -NoNewline
    Write-Host "✅ .env file updated successfully!"
    Write-Host "DATABASE_URL updated with provided password."
} else {
    Write-Host "❌ .env file not found!"
}

