#!/bin/bash

echo "🎮 Starting Smart Tic Tac Toe..."
echo ""

# Start Backend
echo "Starting Backend (.NET)..."
cd Backend
dotnet run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start Frontend
echo "Starting Frontend (React)..."
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Application started!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
