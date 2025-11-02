#!/bin/bash

# Sharif Digital Hub - WiFi Billing System Backup Script
# Copyright (c) 2024 Sharif Digital Hub. All rights reserved.

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/wifi-billing"
DB_NAME="${DB_NAME:-wifi_billing}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
S3_BUCKET="${BACKUP_S3_BUCKET:-}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="/var/log/wifi-billing-backup.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

log "Starting backup process..."

# Database backup
log "Creating database backup..."
DB_BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-password --verbose --clean --if-exists \
    > "$DB_BACKUP_FILE" || error_exit "Database backup failed"

# Compress database backup
log "Compressing database backup..."
gzip "$DB_BACKUP_FILE" || error_exit "Compression failed"
DB_BACKUP_FILE="$DB_BACKUP_FILE.gz"

# Application files backup
log "Creating application files backup..."
APP_BACKUP_FILE="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"
tar -czf "$APP_BACKUP_FILE" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='.git' \
    -C /var/www wifi-billing || error_exit "Application backup failed"

# Configuration backup
log "Creating configuration backup..."
CONFIG_BACKUP_FILE="$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
tar -czf "$CONFIG_BACKUP_FILE" \
    /etc/nginx/sites-available/wifi-billing \
    /etc/systemd/system/wifi-billing.service \
    /var/www/wifi-billing/.env 2>/dev/null || log "Some config files not found"

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ]; then
    log "Uploading backups to S3..."
    aws s3 cp "$DB_BACKUP_FILE" "s3://$S3_BUCKET/database/" || log "S3 database upload failed"
    aws s3 cp "$APP_BACKUP_FILE" "s3://$S3_BUCKET/application/" || log "S3 application upload failed"
    aws s3 cp "$CONFIG_BACKUP_FILE" "s3://$S3_BUCKET/configuration/" || log "S3 config upload failed"
fi

# Cleanup old backups
log "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
log "Verifying backup integrity..."
if gzip -t "$DB_BACKUP_FILE" && tar -tzf "$APP_BACKUP_FILE" >/dev/null; then
    log "Backup verification successful"
else
    error_exit "Backup verification failed"
fi

# Calculate backup sizes
DB_SIZE=$(du -h "$DB_BACKUP_FILE" | cut -f1)
APP_SIZE=$(du -h "$APP_BACKUP_FILE" | cut -f1)
CONFIG_SIZE=$(du -h "$CONFIG_BACKUP_FILE" | cut -f1)

log "Backup completed successfully!"
log "Database backup: $DB_SIZE"
log "Application backup: $APP_SIZE"
log "Configuration backup: $CONFIG_SIZE"

# Send notification (webhook)
if [ -n "${ALERT_WEBHOOK_URL:-}" ]; then
    curl -X POST "$ALERT_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"text\": \"✅ WiFi Billing System backup completed successfully\",
            \"attachments\": [{
                \"color\": \"good\",
                \"fields\": [
                    {\"title\": \"Database\", \"value\": \"$DB_SIZE\", \"short\": true},
                    {\"title\": \"Application\", \"value\": \"$APP_SIZE\", \"short\": true},
                    {\"title\": \"Configuration\", \"value\": \"CONFIG_SIZE\", \"short\": true},
                    {\"title\": \"Timestamp\", \"value\": \"$TIMESTAMP\", \"short\": true}
                ]
            }]
        }" 2>/dev/null || log "Webhook notification failed"
fi

log "Backup process completed at $(date)"