@echo off
REM Hospital Management System - Quick Setup Script for Windows

setlocal enabledelayedexpansion

echo.
echo ============================================
echo Hospital Management System - Setup
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Python version:
python --version

echo Node.js version:
node --version

echo.
echo Setting up Backend...
echo.

cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo Running migrations...
python manage.py migrate --quiet

echo.
echo.
echo Backend setup complete!
echo.

cd ..

echo.
echo Setting up Frontend...
echo.

cd frontend

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install --quiet
)

echo.
echo.
echo Frontend setup complete!
echo.

cd ..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo 1. Open Terminal 1 and run:
echo    cd backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Open Terminal 2 and run:
echo    cd frontend
echo    npm start
echo.
echo Access the application:
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:8000/api
echo   Admin:    http://localhost:8000/admin
echo.
echo For production deployment, see DEPLOYMENT_GUIDE.md
echo.
pause
