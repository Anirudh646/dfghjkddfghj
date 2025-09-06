@echo off
REM AI Admission Counsellor Platform Deployment Script for Windows
REM This script handles deployment to various environments

setlocal EnableDelayedExpansion

REM Configuration
set PROJECT_NAME=ai-admission-counsellor
set SCRIPT_DIR=%~dp0

REM Colors for output (Windows compatible)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function definitions
goto :main

:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:check_requirements
call :print_status "Checking deployment requirements..."

where docker >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Docker not found. Please install Docker Desktop."
    exit /b 1
)

where docker-compose >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Docker Compose not found. Please install Docker Compose."
    exit /b 1
)

call :print_success "All requirements satisfied!"
goto :eof

:setup_environment
call :print_status "Setting up environment..."

if not exist ".env" (
    if exist "deployment.env.example" (
        copy "deployment.env.example" ".env" >nul
        call :print_warning "Created .env from template. Please update with your actual values!"
        call :print_warning "Edit .env file with your configuration before continuing."
        exit /b 1
    ) else (
        call :print_error ".env file not found and no template available!"
        exit /b 1
    )
)

call :print_success "Environment configuration ready!"
goto :eof

:setup_databases
call :print_status "Setting up databases..."

REM Create necessary directories
if not exist "logs" mkdir logs
if not exist "init-scripts" mkdir init-scripts
if not exist "mongo-init" mkdir mongo-init

REM Create PostgreSQL init script
echo -- Create database if not exists > init-scripts\01-init.sql
echo CREATE DATABASE IF NOT EXISTS admission_counsellor; >> init-scripts\01-init.sql

REM Create MongoDB init script
echo // MongoDB initialization script > mongo-init\01-init.js
echo db = db.getSiblingDB('admission_counsellor_docs'); >> mongo-init\01-init.js
echo db.createCollection('essays'); >> mongo-init\01-init.js
echo db.essays.createIndex({ "student_id": 1 }); >> mongo-init\01-init.js
echo print("Database initialized successfully!"); >> mongo-init\01-init.js

call :print_success "Database setup scripts created!"
goto :eof

:deploy_docker
call :print_status "Deploying with Docker Compose..."

call :print_status "Building application images..."
docker-compose build --no-cache
if %errorlevel% neq 0 (
    call :print_error "Failed to build images!"
    exit /b 1
)

call :print_status "Starting services..."
docker-compose up -d
if %errorlevel% neq 0 (
    call :print_error "Failed to start services!"
    exit /b 1
)

call :print_status "Waiting for services to start..."
timeout /t 30 /nobreak >nul

call :print_success "Deployment completed!"
call :print_status "Application URLs:"
call :print_status "  Frontend: http://localhost:3000"
call :print_status "  Backend API: http://localhost:8000"
call :print_status "  API Docs: http://localhost:8000/docs"
goto :eof

:show_status
call :print_status "Checking deployment status..."
docker-compose ps
goto :eof

:stop_deployment
call :print_status "Stopping deployment..."
docker-compose down
call :print_success "Docker Compose deployment stopped!"
goto :eof

:cleanup_deployment
call :print_status "Cleaning up deployment..."
docker-compose down -v --remove-orphans
docker system prune -f
call :print_success "Cleanup completed!"
goto :eof

:show_logs
if "%~1"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %~1
)
goto :eof

:show_help
echo AI Admission Counsellor Deployment Script for Windows
echo.
echo Usage: deploy.bat [COMMAND] [OPTIONS]
echo.
echo Commands:
echo   deploy          Deploy the application locally with Docker
echo   status          Show deployment status
echo   logs [SERVICE]  Show logs (optionally for specific service)
echo   stop            Stop the deployment
echo   cleanup         Stop and clean up deployment
echo   help            Show this help message
echo.
echo Examples:
echo   deploy.bat deploy         # Deploy locally with Docker
echo   deploy.bat logs backend   # Show backend logs
echo   deploy.bat status         # Check deployment status
goto :eof

:main
cd /d "%SCRIPT_DIR%"

if "%~1"=="deploy" (
    call :check_requirements
    if !errorlevel! equ 0 (
        call :setup_environment
        if !errorlevel! equ 0 (
            call :setup_databases
            call :deploy_docker
        ) else (
            call :print_error "Please configure .env file first!"
            exit /b 1
        )
    )
) else if "%~1"=="status" (
    call :show_status
) else if "%~1"=="logs" (
    call :show_logs "%~2"
) else if "%~1"=="stop" (
    call :stop_deployment
) else if "%~1"=="cleanup" (
    call :cleanup_deployment
) else (
    call :show_help
)

endlocal
