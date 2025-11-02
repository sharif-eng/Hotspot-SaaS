# Sharif Digital Hub - WiFi Hotspot Billing System

A secure, modular billing system for WiFi hotspot businesses with mobile money integration, voucher automation, and real-time monitoring.

**Developed by Sharif Digital Hub** - Your trusted partner for digital solutions.

## 🚀 Features

- **🔐 Robust Security**: JWT authentication, role-based access control, rate limiting, audit logging
- **💳 Mobile Money Integration**: MTN and Airtel mobile money APIs for seamless payments
- **🎟️ Voucher Automation**: Automatic voucher generation and MikroTik RouterOS integration
- **📊 Real-time Dashboard**: Usage stats, revenue tracking, system health monitoring
- **🧩 Scalable Architecture**: Multi-zone support, user tiers, modular design

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL 14+
- MikroTik RouterOS devices (for hotspot management)
- MTN/Airtel Mobile Money API credentials

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd Billing
pnpm install
```

### 2. Database Setup

```bash
# Start PostgreSQL and create database
createdb wifi_billing

# Configure environment variables
cp api/.env.example api/.env
# Edit api/.env with your database URL and API keys

# Run database migrations
cd api
pnpm prisma migrate dev
pnpm prisma generate
```

### 3. Environment Configuration

Update `api/.env` with your settings:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wifi_billing"

# Security
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
ENCRYPTION_KEY="your-32-char-encryption-key-here"

# Mobile Money APIs
MTN_SUBSCRIPTION_KEY="your-mtn-subscription-key"
MTN_API_USER_ID="your-mtn-api-user-id"
MTN_API_KEY="your-mtn-api-key"

AIRTEL_CLIENT_ID="your-airtel-client-id"
AIRTEL_CLIENT_SECRET="your-airtel-client-secret"
```

### 4. Start Development Servers

```bash
# Start API server
cd api
pnpm run start:dev

# Start dashboard (in new terminal)
cd dashboard
pnpm run dev
```

## 🏗️ Architecture

### Backend (NestJS)
- **Authentication**: JWT with refresh tokens, role-based access
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, rate limiting, input validation
- **Payments**: MTN/Airtel mobile money integration
- **MikroTik**: RouterOS API for hotspot management
- **Monitoring**: Real-time stats and health checks

### Frontend (React)
- **UI**: Tailwind CSS with responsive design
- **State**: React Query for server state management
- **Routing**: React Router with protected routes
- **Charts**: Recharts for data visualization

## 📊 Database Schema

Key entities:
- **Users**: Customer accounts with profiles and tiers
- **Vouchers**: Access codes with plans and expiration
- **Payments**: Mobile money transactions
- **Sessions**: Active hotspot connections
- **Zones**: MikroTik hotspot locations
- **AuditLogs**: Security and activity tracking

## 🔧 Configuration

### MikroTik Setup

1. Enable API service:
```
/ip service enable api
/ip service set api port=8728
```

2. Create API user:
```
/user add name=api-user password=secure-password group=full
```

3. Configure hotspot profiles in RouterOS

### Mobile Money Setup

#### MTN Mobile Money
1. Register at [MTN Developer Portal](https://momodeveloper.mtn.com)
2. Create Collections API subscription
3. Generate API user and key
4. Configure callback URLs

#### Airtel Money
1. Register at [Airtel Developer Portal](https://developers.airtel.africa)
2. Create merchant account
3. Get client credentials
4. Configure webhook endpoints

## 🚀 Deployment

### Production Environment

1. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. **API**: Deploy to containerized environment (Docker, Kubernetes)
3. **Frontend**: Build and serve static files (Nginx, CDN)
4. **Security**: Use HTTPS, environment secrets, firewall rules

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables (Production)

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="complex-production-secret"
CORS_ORIGIN="https://yourdomain.com"

# Use production API endpoints
MTN_API_URL="https://api.mtn.com"
AIRTEL_API_URL="https://openapi.airtel.africa"
```

## 🔒 Security Features

- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Request sanitization
- **Audit Logging**: Complete activity tracking
- **Encryption**: Sensitive data protection
- **CORS**: Cross-origin request security

## 📈 Monitoring

### Dashboard Metrics
- Real-time user sessions
- Revenue tracking and trends
- Voucher usage statistics
- System health indicators
- Zone utilization rates

### Automated Tasks
- Session cleanup (expired vouchers)
- Log rotation (30-day retention)
- Payment status synchronization
- Health check notifications

## 🛡️ Admin Features

### User Management
- Create/edit user accounts
- Assign roles and permissions
- View user activity logs
- Manage user tiers and limits

### Voucher Management
- Create voucher plans
- Generate bulk vouchers
- Track usage and expiration
- Configure pricing tiers

### Zone Management
- Add/configure hotspot zones
- Monitor zone performance
- Manage MikroTik connections
- Set capacity limits

## 🔧 Maintenance

### Regular Tasks
- Database backups
- Log monitoring
- Security updates
- Performance optimization

### Troubleshooting
- Check API logs: `pnpm logs`
- Database health: Monitor connection pool
- MikroTik connectivity: Test API endpoints
- Payment status: Verify webhook delivery

## 📞 Support

For technical support and customization:
- Review logs in `/var/log/wifi-billing/`
- Check system health at `/api/monitoring/health`
- Monitor payment webhooks
- Verify MikroTik API connectivity

## 📄 License & Copyright

© 2024 Sharif Digital Hub. All rights reserved.

This project is proprietary software developed by Sharif Digital Hub. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit written permission from Sharif Digital Hub.

**Contact Information:**
- Company: Sharif Digital Hub
- Website: [Your Website]
- Email: [Your Email]
- Phone: [Your Phone]

For licensing inquiries and commercial use, please contact Sharif Digital Hub.