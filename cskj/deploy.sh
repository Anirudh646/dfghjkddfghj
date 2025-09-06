#!/bin/bash

# AI Admission Counsellor Platform Deployment Script
# This script handles deployment to various environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="ai-admission-counsellor"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check requirements
check_requirements() {
    print_status "Checking deployment requirements..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All requirements satisfied!"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f ".env" ]; then
        if [ -f "deployment.env.example" ]; then
            cp deployment.env.example .env
            print_warning "Created .env from template. Please update with your actual values!"
            print_warning "Edit .env file with your configuration before continuing."
            return 1
        else
            print_error ".env file not found and no template available!"
            return 1
        fi
    fi
    
    print_success "Environment configuration ready!"
    return 0
}

# Function to setup databases
setup_databases() {
    print_status "Setting up databases..."
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p init-scripts
    mkdir -p mongo-init
    
    # Create PostgreSQL init script
    cat > init-scripts/01-init.sql << 'EOF'
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS admission_counsellor;

-- Create user for application (optional)
-- CREATE USER admission_app WITH PASSWORD 'secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE admission_counsellor TO admission_app;
EOF

    # Create MongoDB init script
    cat > mongo-init/01-init.js << 'EOF'
// MongoDB initialization script
db = db.getSiblingDB('admission_counsellor_docs');

// Create collections with indexes
db.createCollection('essays');
db.essays.createIndex({ "student_id": 1 });
db.essays.createIndex({ "created_at": -1 });

db.createCollection('documents');
db.documents.createIndex({ "student_id": 1 });
db.documents.createIndex({ "type": 1 });

db.createCollection('essay_reviews');
db.essay_reviews.createIndex({ "essay_id": 1 });
db.essay_reviews.createIndex({ "reviewed_at": -1 });

print("Database initialized successfully!");
EOF

    print_success "Database setup scripts created!"
}

# Function to build and deploy with Docker Compose
deploy_docker() {
    print_status "Deploying with Docker Compose..."
    
    # Pull latest images
    print_status "Pulling base images..."
    docker-compose pull postgres mongodb redis nginx || true
    
    # Build custom images
    print_status "Building application images..."
    docker-compose build --no-cache
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check service health
    if docker-compose ps | grep -q "unhealthy\|Exit"; then
        print_error "Some services failed to start properly!"
        docker-compose logs
        return 1
    fi
    
    print_success "All services started successfully!"
    
    # Run database migrations
    print_status "Running database migrations..."
    docker-compose exec backend alembic upgrade head || print_warning "Migration failed - database might need manual setup"
    
    print_success "Deployment completed!"
    print_status "Application URLs:"
    print_status "  Frontend: http://localhost:3000"
    print_status "  Backend API: http://localhost:8000"
    print_status "  API Docs: http://localhost:8000/docs"
}

# Function to deploy to cloud platforms
deploy_cloud() {
    local platform=$1
    
    case $platform in
        "railway")
            deploy_railway
            ;;
        "render")
            deploy_render
            ;;
        "digitalocean")
            deploy_digitalocean
            ;;
        "aws")
            deploy_aws
            ;;
        *)
            print_error "Unsupported platform: $platform"
            print_status "Supported platforms: railway, render, digitalocean, aws"
            return 1
            ;;
    esac
}

# Function to deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command_exists railway; then
        print_error "Railway CLI not found. Install from: https://railway.app/cli"
        return 1
    fi
    
    # Login and create project
    railway login
    railway init
    
    # Deploy services
    railway up
    
    print_success "Deployed to Railway!"
    railway status
}

# Function to show deployment status
show_status() {
    print_status "Checking deployment status..."
    
    if command_exists docker-compose; then
        echo
        print_status "Docker Compose Services:"
        docker-compose ps
        
        echo
        print_status "Service Health:"
        docker-compose exec backend curl -f http://localhost:8000/health || print_warning "Backend health check failed"
        docker-compose exec frontend curl -f http://localhost:3000 || print_warning "Frontend health check failed"
    fi
}

# Function to stop deployment
stop_deployment() {
    print_status "Stopping deployment..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose down
        print_success "Docker Compose deployment stopped!"
    fi
}

# Function to clean up deployment
cleanup_deployment() {
    print_status "Cleaning up deployment..."
    
    if [ -f "docker-compose.yml" ]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    fi
}

# Function to show logs
show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Function to show help
show_help() {
    echo "AI Admission Counsellor Deployment Script"
    echo
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  deploy          Deploy the application locally with Docker"
    echo "  cloud PLATFORM Deploy to cloud platform (railway, render, digitalocean, aws)"
    echo "  status          Show deployment status"
    echo "  logs [SERVICE]  Show logs (optionally for specific service)"
    echo "  stop            Stop the deployment"
    echo "  cleanup         Stop and clean up deployment"
    echo "  help            Show this help message"
    echo
    echo "Examples:"
    echo "  $0 deploy                 # Deploy locally with Docker"
    echo "  $0 cloud railway          # Deploy to Railway"
    echo "  $0 logs backend           # Show backend logs"
    echo "  $0 status                 # Check deployment status"
}

# Main script logic
main() {
    cd "$SCRIPT_DIR"
    
    case "${1:-help}" in
        "deploy")
            check_requirements
            if setup_environment; then
                setup_databases
                deploy_docker
            else
                print_error "Please configure .env file first!"
                exit 1
            fi
            ;;
        "cloud")
            if [ -z "$2" ]; then
                print_error "Please specify a cloud platform"
                show_help
                exit 1
            fi
            deploy_cloud "$2"
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2"
            ;;
        "stop")
            stop_deployment
            ;;
        "cleanup")
            cleanup_deployment
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
