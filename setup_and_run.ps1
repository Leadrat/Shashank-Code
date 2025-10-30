# Set environment variables
$env:JWT_SECRET="YourSuperSecretKeyThatIsAtLeast32CharactersLong"
$env:JWT_ISSUER="TicTacToeServer"
$env:JWT_AUDIENCE="TicTacToeClient"
$env:JWT_EXPIRATION_MINUTES="60"

# Navigate to backend directory
Set-Location "$PSScriptRoot\Backend"

# Restore packages
Write-Host "Restoring packages..." -ForegroundColor Cyan
dotnet restore

# Create and update database
Write-Host "Creating database..." -ForegroundColor Cyan

# Remove existing SQLite database if exists
$dbPath = Join-Path $PSScriptRoot "Backend\tictactoe.db"
if (Test-Path $dbPath) {
    Remove-Item $dbPath -Force
}

# Run migrations
dotnet ef database update

# Start the application
Write-Host "Starting the application..." -ForegroundColor Green
Write-Host "API will be available at: https://localhost:5001" -ForegroundColor Green
Write-Host "Swagger UI: https://localhost:5001/swagger" -ForegroundColor Green

dotnet run
