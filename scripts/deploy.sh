#!/bin/bash

# Sharif Digital Hub - WiFi Billing System Deployment Script
# Copyright (c) 2024 Sharif Digital Hub. All rights reserved.

set -euo pipefail

# Configuration
APP_DIR="/var/www/wifi-billing"
BACKUP_DIR="/var/backups/wifi-billing/deployments"
SERVICE_NAME="wifi-billing"
NGINX_CONFIG="/etc/nginx/sites-available/wifi-billing"
LOG_FILE="/var/log/wifi-billing-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

success() {
    log "${GREEN}✅ $1${NC}"
}

warning() {
    log "${YELLOW}⚠️  $1${NC}"
}

error() {
    log "${RED}❌ $1${NC}"
    exit 1
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."
    
    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
    
    # Check required commands
    for cmd in git node pnpm nginx systemctl; do
        if ! command -v $cmd &> /dev/null; then
            error "$cmd is not installed"
        fi
    done
    
    # Check disk space (minimum 1GB)
    available_space=$(df / | awk 'NR==2 {print $4}')
    if [ $available_space -lt 1048576 ]; then
        error "Insufficient disk space. At least 1GB required."
    fi
    
    success "Pre-deployment checks passed"
}

# Create deployment backup
create_backup() {
    log "Creating deployment backup..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="pre-deploy-$(date +%Y%m%d_%H%M%S)"
    
    if [ -d "$APP_DIR" ]; then
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$(dirname $APP_DIR)" "$(basename $APP_DIR)"
        success "Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
    else
        warning "No existing application directory to backup"
    fi
}

# Deploy application
deploy_app() {
    log "Deploying application..."
    
    # Stop services
    systemctl stop $SERVICE_NAME || warning "Service not running"
    
    # Create app directory if it doesn't exist
    mkdir -p "$APP_DIR"
    cd "$APP_DIR"
    
    # Clone or pull latest code
    if [ -d ".git" ]; then
        log "Pulling latest changes..."
        git pull origin main
    else
        log "Cloning repository..."
        git clone https://github.com/your-repo/wifi-billing.git .
    fi
    
    # Install dependencies
    log "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Build API
    log "Building API..."
    cd api
    pnpm run build
    pnpm prisma generate
    
    # Build Dashboard
    log "Building dashboard..."
    cd ../dashboard
    pnpm run build
    
    cd "$APP_DIR"
    success "Application deployed successfully"
}

# Database migration
run_migrations() {
    log "Running database migrations..."
    
    cd "$APP_DIR/api"
    
    # Backup database before migration
    if command -v pg_dump &> /dev/null; then
        pg_dump $DB_NAME > "$BACKUP_DIR/db-pre-migration-$(date +%Y%m%d_%H%M%S).sql" || warning "Database backup failed"
    fi
    
    # Run migrations
    pnpm prisma migrate deploy || error "Database migration failed"
    
    success "Database migrations completed"
}

# Configure services
configure_services() {
    log "Configuring services..."
    
    # Create systemd service file
    cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Sharif Digital Hub WiFi Billing System
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR/api
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/api/.env

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    
    success "Service configured"
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Copy nginx configuration
    cp nginx.production.conf "$NGINX_CONFIG"
    
    # Test nginx configuration
    nginx -t || error "Nginx configuration test failed"
    
    # Enable site
    ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    
    success "Nginx configured"
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start application
    systemctl start $SERVICE_NAME
    systemctl status $SERVICE_NAME --no-pager
    
    # Reload nginx
    systemctl reload nginx
    
    # Wait for application to start
    sleep 10
    
    # Health check
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        success "Application is healthy"
    else
        error "Application health check failed"
    fi
    
    success "Services started successfully"
}

# Post-deployment tasks
post_deploy() {
    log "Running post-deployment tasks..."
    
    # Set proper permissions
    chown -R www-data:www-data "$APP_DIR"
    chmod -R 755 "$APP_DIR"
    
    # Setup log rotation
    cat > /etc/logrotate.d/wifi-billing << EOF
/var/log/wifi-billing*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload $SERVICE_NAME
    endscript
}
EOF

    # Setup cron jobs
    (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/backup.sh") | crontab -
    
    success "Post-deployment tasks completed"
}

# Rollback function
rollback() {
    log "Rolling back deployment..."
    
    # Stop current service
    systemctl stop $SERVICE_NAME
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/pre-deploy-*.tar.gz 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restoring from backup: $LATEST_BACKUP"
        rm -rf "$APP_DIR"
        mkdir -p "$(dirname $APP_DIR)"
        tar -xzf "$LATEST_BACKUP" -C "$(dirname $APP_DIR)"
        
        # Start service
        systemctl start $SERVICE_NAME
        
        success "Rollback completed"
    else
        error "No backup found for rollback"
    fi
}

# Main deployment function
main() {
    log "Starting deployment of Sharif Digital Hub WiFi Billing System..."
    
    case "${1:-deploy}" in
        "deploy")
            pre_deploy_checks
            create_backup
            deploy_app
            run_migrations
            configure_services
            configure_nginx
            start_services
            post_deploy
            success "Deployment completed successfully!"
            ;;
        "rollback")
            rollback
            ;;
        "health")
            curl -f http://localhost:3000/api/health || error "Health check failed"
            success "Application is healthy"
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health}"
            exit 1
            ;;
    esac
}

# Trap errors and provide rollback option
trap 'error "Deployment failed. Run: $0 rollback"' ERR

main "$@"