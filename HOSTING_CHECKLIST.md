# Hospital Management System - Production Hosting Checklist

## ✅ Pre-Deployment Setup

### Code Preparation
- [ ] All components using centralized API configuration (api.js)
- [ ] No hardcoded URLs (localhost:8000)
- [ ] Environment variables defined (.env files)
- [ ] Dependencies listed in requirements.txt and package.json
- [ ] Database migrations created
- [ ] Admin interface configured

### Configuration Files
- [ ] `backend/.env` created with production values
- [ ] `frontend/.env` created with production API URL
- [ ] `Dockerfile.backend` configured
- [ ] `Dockerfile.frontend` configured
- [ ] `docker-compose.yml` updated with domain
- [ ] `nginx.conf` configured for reverse proxy

### Security
- [ ] SECRET_KEY changed to random value (min 50 chars)
- [ ] DEBUG set to False
- [ ] ALLOWED_HOSTS updated with domain
- [ ] CORS_ALLOWED_ORIGINS updated
- [ ] Database password set (if using external DB)
- [ ] SSL/HTTPS certificate ready (Let's Encrypt)

## 🚀 Deployment Methods

### Option A: Docker Compose (Recommended)

**Hosting Provider**: AWS EC2, DigitalOcean, Linode, or any Linux VPS

#### Step 1: Server Setup
```bash
# SSH into server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone project
git clone https://github.com/yourusername/hospital-mgmt.git
cd hospital-mgmt/hospital-management-system
```

#### Step 2: Configure Environment
```bash
# Edit backend/.env
nano backend/.env

# Content:
SECRET_KEY=your-super-secret-key-here-50-chars-minimum
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Edit frontend/.env
nano frontend/.env

# Content:
REACT_APP_API_URL=https://yourdomain.com/api
```

#### Step 3: Start Services
```bash
# Start in background
docker-compose up -d

# Verify running
docker-compose ps

# Check logs
docker-compose logs -f
```

#### Step 4: Initialize Database
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Create superuser (automated)
docker-compose exec backend bash -c 'echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser(\"admin\", \"admin@example.com\", \"password\") if not User.objects.filter(username=\"admin\").exists() else None" | python manage.py shell'
```

#### Step 5: Configure Domain DNS
1. Point domain to server IP in DNS settings
2. Wait for DNS propagation (5-30 minutes)
3. Verify: `nslookup yourdomain.com`

#### Step 6: Setup SSL/HTTPS
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx.conf with certificate paths
# Then restart Docker services:
docker-compose down
docker-compose up -d
```

### Option B: Heroku (Easiest)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create Procfile:
```
web: gunicorn config.wsgi
release: python manage.py migrate
```
3. Create `.gitignore`:
```
venv/
node_modules/
db.sqlite3
.env
```
4. Deploy:
```bash
heroku login
heroku create hospital-mgmt
git push heroku main
heroku run python manage.py createsuperuser
heroku open
```

### Option C: Railway (Very Easy)

1. Sign up at https://railway.app
2. Connect GitHub repository
3. Add environment variables in dashboard
4. Auto-deploys on push

### Option D: Traditional VPS (Full Control)

See DEPLOYMENT_GUIDE.md for manual setup with Gunicorn + Nginx

## 📊 Performance Checklist

### Database
- [ ] Migrate to PostgreSQL (for production)
- [ ] Create database indexes
- [ ] Setup backup cron job
- [ ] Test restore procedure

### Caching
- [ ] Add Redis for caching (optional)
- [ ] Configure cache timeouts
- [ ] Monitor cache hit rates

### Monitoring
- [ ] Setup error logging (Sentry)
- [ ] Configure health checks
- [ ] Setup alerts
- [ ] Monitor disk space
- [ ] Monitor memory usage

## 🔐 Security Checklist

### Server Security
- [ ] Update system packages: `sudo apt-get update && upgrade`
- [ ] Setup firewall (UFW):
  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow 22/tcp   # SSH
  sudo ufw allow 80/tcp   # HTTP
  sudo ufw allow 443/tcp  # HTTPS
  sudo ufw enable
  ```
- [ ] Disable root login
- [ ] Setup SSH key authentication
- [ ] Configure fail2ban for brute force protection

### Application Security
- [ ] HTTPS enforced (SSL certificate)
- [ ] Django CSRF enabled
- [ ] CORS whitelist configured
- [ ] HSTS headers enabled
- [ ] Security headers set
- [ ] Input validation on all fields
- [ ] SQL injection protection (using ORM)
- [ ] XSS protection enabled

### Backups
- [ ] Daily database backups
- [ ] Backup storage (S3, Google Drive, etc.)
- [ ] Test restore procedure monthly
- [ ] Backup encryption enabled

## 📈 Scaling Strategy

### Current Capacity
- SQLite: 50k records
- Load: 100-500 users
- Throughput: 50-100 req/sec

### When to Scale
- Users: >1000
- Requests: >500/sec
- Storage: >10GB

### Scaling Steps
1. Switch to PostgreSQL
2. Add Redis caching
3. Horizontal scaling (multiple API instances)
4. Load balancer (AWS ELB, Nginx)
5. CDN for static files (CloudFlare, AWS CloudFront)

## 🆘 Troubleshooting

### CORS Issues
```bash
# Check CORS_ALLOWED_ORIGINS in .env
docker-compose exec backend env | grep CORS

# Update if needed:
docker-compose down
# Edit .env
docker-compose up -d
```

### API Not Responding
```bash
# Check service status
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Rebuild if needed
docker-compose up -d --build
```

### Database Issues
```bash
# Check database connections
docker-compose exec backend python manage.py dbshell

# Reset database (CAUTION - loses data)
docker-compose exec backend rm db.sqlite3
docker-compose exec backend python manage.py migrate
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew --dry-run
sudo certbot renew

# Auto-renew setup
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📞 Support & Resources

### Documentation
- Django: https://docs.djangoproject.com
- React: https://react.dev
- Docker: https://docs.docker.com
- Nginx: https://nginx.org/en/docs

### Hosting Providers
- AWS: https://aws.amazon.com
- DigitalOcean: https://www.digitalocean.com
- Linode: https://www.linode.com
- Heroku: https://www.heroku.com
- Railway: https://www.railway.app

### Monitoring/Analytics
- Sentry (error tracking): https://sentry.io
- DataDog (monitoring): https://www.datadoghq.com
- New Relic: https://newrelic.com

## 🎯 Post-Deployment

### Week 1
- [ ] Monitor error logs
- [ ] Test all CRUD operations
- [ ] Verify backups working
- [ ] Load test the system
- [ ] Train admin users

### Month 1
- [ ] Analyze performance metrics
- [ ] Optimize slow queries
- [ ] Setup monitoring alerts
- [ ] Security audit
- [ ] Document known issues

### Ongoing
- [ ] Monthly security updates
- [ ] Weekly backup verification
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Feature improvements

## 📝 Important Commands

```bash
# Docker basics
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f backend    # View logs
docker-compose exec backend bash  # SSH into container

# Database
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# Backups
docker cp hospital-mgmt_backend_1:/app/db.sqlite3 ./backup/

# Cleanup
docker system prune              # Remove unused containers
docker volume prune              # Remove unused volumes
```

---

**Status**: Production Ready ✅  
**Last Updated**: December 2025  
**Support**: Community-driven
