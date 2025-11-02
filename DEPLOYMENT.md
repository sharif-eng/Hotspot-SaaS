# Production Deployment Guide

## 🔧 **Pre-Production Checklist**

### Required Information:
- [ ] PostgreSQL database credentials
- [ ] MTN Mobile Money API keys
- [ ] Airtel Money API credentials  
- [ ] MikroTik router access details
- [ ] Domain name and SSL certificate
- [ ] SMTP server for notifications

### Security Requirements:
- [ ] Strong JWT secret (32+ characters)
- [ ] Database encryption at rest
- [ ] HTTPS/SSL certificate
- [ ] Firewall configuration
- [ ] Regular backup strategy

## 🚀 **Quick Test (Development)**

```bash
# 1. Setup
chmod +x setup.sh
./setup.sh

# 2. Configure
cp api/.env.example api/.env
# Edit api/.env with your credentials

# 3. Start
pnpm run dev
```

**Test URLs:**
- Dashboard: http://localhost:5173
- API: http://localhost:3000/api
- Login: admin@sharifdigitalhub.com / admin123

## 🏭 **Production Deployment**

### Option 1: Docker (Recommended)
```bash
# 1. Configure production environment
cp api/.env.example api/.env.production
# Update with production values

# 2. Deploy
docker-compose up -d
```

### Option 2: Manual Deployment
```bash
# 1. Build
pnpm run build

# 2. Database migration
cd api && pnpm prisma migrate deploy

# 3. Start services
pm2 start ecosystem.config.js
```

## 📊 **Monitoring & Maintenance**

### Health Checks:
- API: `/api/monitoring/health`
- Database connectivity
- Mobile money API status
- MikroTik connectivity

### Automated Tasks:
- Session cleanup (hourly)
- Log rotation (daily)
- Database backup (daily)
- Security updates (weekly)

## 🔒 **Security Hardening**

### Production Settings:
```env
NODE_ENV=production
JWT_SECRET="complex-64-character-secret"
CORS_ORIGIN="https://yourdomain.com"
THROTTLE_LIMIT=50
```

### Firewall Rules:
- Port 3000: API (internal only)
- Port 80/443: Dashboard (public)
- Port 5432: Database (internal only)
- Port 8728: MikroTik API (internal only)

## 📞 **Support & Maintenance**

Contact Sharif Digital Hub for:
- Production deployment assistance
- API key configuration
- Custom integrations
- Technical support

Email: support@sharifdigitalhub.com