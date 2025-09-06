# 🚀 Deployment Guide - AI Admission Counsellor Platform

This guide provides comprehensive instructions for deploying the AI Admission Counsellor platform to various environments.

## 📋 Prerequisites

Before deploying, ensure you have:

- **Docker & Docker Compose** (for local/container deployment)
- **Node.js 18+** (for local frontend development)
- **Python 3.11+** (for local backend development)
- **PostgreSQL & MongoDB** (for database deployment)

## 🔧 Quick Start - Local Deployment

### Option 1: One-Click Docker Deployment (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd ai-admission-counsellor
   ```

2. **Configure environment**:
   ```bash
   # Copy environment template
   cp deployment.env.example .env
   
   # Edit .env with your settings (see configuration section below)
   nano .env  # or use your preferred editor
   ```

3. **Deploy with Docker**:
   ```bash
   # Linux/Mac
   ./deploy.sh deploy
   
   # Windows
   deploy.bat deploy
   ```

4. **Access your application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Docker Deployment

```bash
# Start databases and services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## ⚙️ Environment Configuration

### Required Environment Variables

Edit your `.env` file with these essential settings:

```bash
# Database Passwords (Change these!)
POSTGRES_PASSWORD=your_secure_postgres_password
MONGODB_ROOT_PASSWORD=your_secure_mongodb_password
REDIS_PASSWORD=your_secure_redis_password

# Application Security
SECRET_KEY=your_very_secure_secret_key_minimum_32_characters
DEBUG=false

# External API Keys (Required for AI features)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Email Configuration (For notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Optional Configuration

```bash
# Custom domains
FRONTEND_DOMAIN=https://your-frontend-domain.com
BACKEND_DOMAIN=https://your-backend-domain.com

# Email settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

## ☁️ Cloud Deployment Options

### 🚂 Railway (Recommended for Beginners)

Railway provides easy deployment with automatic HTTPS and database provisioning.

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Configure environment variables in Railway dashboard**:
   - Go to your Railway project
   - Add the required environment variables
   - Deploy will automatically restart

**Pros**: Easy setup, automatic HTTPS, built-in databases
**Cost**: $5-20/month depending on usage

### 🎨 Render

Render offers excellent free tier and simple deployment.

1. **Connect your GitHub repository to Render**
2. **Use the provided `render.yaml` configuration**
3. **Set environment variables in Render dashboard**

**Pros**: Great free tier, automatic deployments
**Cost**: Free tier available, $7+/month for paid plans

### ⚡ Vercel + Backend Host

Deploy frontend to Vercel and backend to another service.

#### Frontend to Vercel:
```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Backend options:
- **Railway**: Use railway.toml config
- **Render**: Use render.yaml config  
- **DigitalOcean App Platform**: Use doctl
- **AWS ECS**: Use provided Dockerfile

**Pros**: Excellent frontend performance, global CDN
**Cost**: Vercel free tier + backend hosting costs

### 🌊 DigitalOcean

Deploy using DigitalOcean App Platform or Droplets.

#### App Platform (Easier):
1. Connect GitHub repository
2. Use provided configuration
3. Set environment variables

#### Droplets (More control):
```bash
# Create droplet with Docker
# Clone repository
# Run deployment script
./deploy.sh deploy
```

**Pros**: Predictable pricing, full control
**Cost**: $12+/month for basic setup

### ☁️ AWS

Deploy using various AWS services.

#### Option 1: ECS with Fargate
- Use provided Dockerfile
- Configure ECS task definitions
- Set up Application Load Balancer

#### Option 2: Elastic Beanstalk
- Package application
- Upload to Elastic Beanstalk
- Configure environment

**Pros**: Highly scalable, enterprise-ready
**Cost**: Pay-as-you-go, can be expensive

## 🗄️ Database Setup

### Production Database Options

#### Option 1: Managed Services (Recommended)
- **PostgreSQL**: AWS RDS, Google Cloud SQL, DigitalOcean Managed Databases
- **MongoDB**: MongoDB Atlas, AWS DocumentDB
- **Redis**: AWS ElastiCache, Redis Cloud

#### Option 2: Self-hosted
Use the provided Docker Compose configuration with persistent volumes.

### Database Migration

```bash
# Run migrations after deployment
docker-compose exec backend alembic upgrade head

# Or if using separate backend deployment
python -m alembic upgrade head
```

## 🔒 Security Considerations

### Production Checklist

- [ ] **Change all default passwords**
- [ ] **Use strong SECRET_KEY (32+ characters)**
- [ ] **Enable HTTPS with SSL certificates**
- [ ] **Configure firewall rules**
- [ ] **Set up database backups**
- [ ] **Enable logging and monitoring**
- [ ] **Use environment variables for secrets**
- [ ] **Enable rate limiting**
- [ ] **Configure CORS properly**

### SSL/HTTPS Setup

#### Using Nginx (included in Docker setup):
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Update nginx.conf with SSL configuration
3. Restart nginx service

#### Using cloud providers:
Most cloud providers (Vercel, Railway, Render) provide automatic HTTPS.

## 📊 Monitoring and Maintenance

### Health Checks

The application includes built-in health checks:
- Backend: `GET /health`
- Frontend: `GET /` (homepage)

### Logging

Logs are available through:
```bash
# Docker Compose
docker-compose logs -f [service_name]

# Individual services
docker logs ai_admission_counsellor_backend
```

### Backups

#### Database Backups:
```bash
# PostgreSQL
docker-compose exec postgres pg_dump -U postgres admission_counsellor > backup.sql

# MongoDB
docker-compose exec mongodb mongodump --db admission_counsellor_docs
```

#### Automated Backups:
Set up daily backups using cron jobs or cloud provider backup services.

## 🔧 Troubleshooting

### Common Issues

#### Services won't start:
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose build --no-cache
```

#### Database connection issues:
1. Check environment variables
2. Verify database is running
3. Check network connectivity
4. Review connection strings

#### Frontend can't reach backend:
1. Verify NEXT_PUBLIC_API_URL
2. Check CORS configuration
3. Ensure backend is accessible

### Performance Optimization

#### Backend:
- Use Redis for caching
- Optimize database queries
- Enable gzip compression
- Set up connection pooling

#### Frontend:
- Enable static file caching
- Use CDN for assets
- Optimize images
- Enable service worker

## 📱 Scaling Considerations

### Horizontal Scaling

#### Load Balancing:
- Use Nginx or cloud load balancers
- Configure session affinity if needed
- Implement health checks

#### Database Scaling:
- Read replicas for PostgreSQL
- MongoDB sharding for large datasets
- Redis clustering for cache

#### Container Orchestration:
- Kubernetes for complex deployments
- Docker Swarm for simpler setups
- Cloud container services (EKS, GKE, AKS)

## 💰 Cost Estimates

### Development/Testing:
- **Local**: Free (uses local resources)
- **Railway**: $5-10/month
- **Render**: Free tier available

### Production:
- **Small**: $20-50/month (Railway/Render)
- **Medium**: $100-300/month (DigitalOcean/AWS)
- **Large**: $500+/month (Full AWS/GCP setup)

## 🆘 Support

### Getting Help

1. **Check logs first**: Most issues are visible in application logs
2. **Review configuration**: Verify all environment variables
3. **Test connectivity**: Ensure services can communicate
4. **Check documentation**: Review API docs and error messages

### Useful Commands

```bash
# Check service status
./deploy.sh status

# View specific service logs
./deploy.sh logs backend

# Restart services
docker-compose restart

# Update application
git pull && ./deploy.sh deploy

# Backup data
./deploy.sh backup

# Clean up
./deploy.sh cleanup
```

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# Run any new migrations
docker-compose exec backend alembic upgrade head
```

### Regular Maintenance

- **Weekly**: Check logs and performance
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate secrets
- **Annually**: Major version updates and infrastructure review

---

## 🎉 Congratulations!

Your AI Admission Counsellor platform is now deployed and ready to help students with their college journey!

For additional support or custom deployment needs, refer to the main documentation or create an issue in the repository.
