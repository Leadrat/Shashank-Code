# Start Smart Tic Tac Toe Application

Write-Host "🎮 Starting Smart Tic Tac Toe..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Starting Backend (.NET)..." -ForegroundColor Yellow
Set-Location Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run"
Set-Location ..

Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Set-Location Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Set-Location ..

Write-Host ""
Write-Host "✅ Application started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "The application windows will open in separate PowerShell windows." -ForegroundColor Cyan
Write-Host "Close those windows to stop the services." -ForegroundColor Cyan
