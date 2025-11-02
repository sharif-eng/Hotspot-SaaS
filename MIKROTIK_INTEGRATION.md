# MikroTik Hotspot Integration Guide

## Overview

The WiFi Billing System integrates with MikroTik RouterOS through a **captive portal redirect** mechanism. Here's the complete flow:

## Integration Architecture

```
User Device → MikroTik Captive Portal → Billing System Landing Page → Payment → Voucher → MikroTik Login → Internet Access
```

## Step 1: MikroTik Configuration

### 1.1 Enable API Service
```bash
/ip service enable api
/ip service set api port=8728
```

### 1.2 Create API User
```bash
/user add name=billing-api password=secure-api-password group=full
```

### 1.3 Configure Hotspot Server
```bash
# Create hotspot server profile
/ip hotspot profile add name=billing-profile login-by=http-chap,cookie

# Set custom login page
/ip hotspot profile set billing-profile html-directory=hotspot
```

### 1.4 Custom Login Page
Create `/flash/hotspot/login.html` on MikroTik:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WiFi Access - Sharif Digital Hub</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; text-align: center; }
        .redirect-message { background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="redirect-message">
        <h2>Redirecting to Payment Portal...</h2>
        <p>Please wait while we redirect you to complete your payment.</p>
    </div>
    
    <script>
        // Get MikroTik parameters
        const params = new URLSearchParams(window.location.search);
        
        // Build redirect URL with all MikroTik parameters
        const redirectUrl = 'http://192.168.1.100:5176/hotspot-landing?' + params.toString();
        
        // Redirect to billing system
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    </script>
</body>
</html>
```

## Step 2: Billing System Configuration

### 2.1 Environment Variables
Add to `api/.env`:
```env
# MikroTik Configuration
DEFAULT_MIKROTIK_IP=192.168.1.1
DEFAULT_MIKROTIK_USER=billing-api
DEFAULT_MIKROTIK_PASSWORD=secure-api-password
DEFAULT_MIKROTIK_PORT=8728
```

### 2.2 Hotspot Profiles
The system automatically creates these MikroTik profiles:
- `30min` - 30 minutes, 2M/2M speed limit
- `1hour` - 1 hour, 5M/5M speed limit  
- `3hour` - 3 hours, 10M/10M speed limit
- `daily` - 24 hours, 20M/20M speed limit

## Step 3: User Journey Flow

### 3.1 Initial Connection
1. User connects to WiFi network
2. MikroTik detects unauthenticated user
3. Captive portal activates
4. User redirected to `/flash/hotspot/login.html`
5. JavaScript redirects to billing system: `http://your-server:5176/hotspot-landing`

### 3.2 Package Selection & Payment
1. User sees available internet packages
2. Selects desired package (30min, 1hour, 3hour, daily)
3. Gets MTN Mobile Money payment instructions
4. Makes payment via *165# USSD
5. Enters phone number and transaction ID

### 3.3 Voucher Generation
1. System verifies payment with MTN API
2. Creates voucher record in database
3. Generates unique voucher code (e.g., "ABC123XY")
4. Adds user to MikroTik with voucher code as username/password
5. Sets appropriate time limit and speed profile

### 3.4 Internet Access
1. User gets voucher code displayed
2. Redirected back to MikroTik login page
3. Enters voucher code as both username and password
4. MikroTik authenticates and grants internet access
5. Session tracked in both MikroTik and billing system

## Step 4: API Integration Points

### 4.1 Payment Verification Endpoint
```
POST /api/payments/verify-and-generate
{
  "phoneNumber": "256701234567",
  "transactionId": "MP240101.1234.A12345", 
  "packageId": "standard-60",
  "mikrotikParams": {
    "dst": "http://google.com",
    "serverAddress": "192.168.1.1"
  }
}
```

### 4.2 MikroTik User Management
```javascript
// Add hotspot user
await mikrotikService.addHotspotUser({
  username: "ABC123XY",
  password: "ABC123XY", 
  profile: "1hour",
  timeLimit: "01:00:00"
});

// Remove expired user
await mikrotikService.removeHotspotUser("ABC123XY");
```

## Step 5: Monitoring & Management

### 5.1 Active Sessions
- View active users in admin dashboard
- Monitor data usage and session time
- Disconnect users manually if needed

### 5.2 Automated Cleanup
- Expired vouchers automatically removed from MikroTik
- Session logs maintained for 30 days
- Payment records kept for accounting

## Step 6: Deployment Checklist

### 6.1 Network Setup
- [ ] MikroTik configured with hotspot server
- [ ] API service enabled and user created
- [ ] Custom login page uploaded
- [ ] Billing system server accessible from MikroTik network

### 6.2 System Configuration  
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] MTN Mobile Money API credentials added
- [ ] Default hotspot zone created

### 6.3 Testing
- [ ] Connect device to WiFi
- [ ] Verify redirect to billing system
- [ ] Test payment flow (use test credentials)
- [ ] Confirm voucher generation
- [ ] Validate internet access with voucher

## Troubleshooting

### Common Issues

1. **Redirect not working**
   - Check MikroTik login.html file
   - Verify billing system URL is accessible
   - Check firewall rules

2. **Payment verification fails**
   - Verify MTN API credentials
   - Check transaction ID format
   - Review API logs

3. **Voucher login fails**
   - Confirm MikroTik API connection
   - Check hotspot profiles exist
   - Verify user was added to MikroTik

### Debug Commands

```bash
# Check MikroTik API connection
curl -X POST http://localhost:3000/api/zones/test-connection

# View active hotspot users
/ip hotspot active print

# Check hotspot user profiles  
/ip hotspot user profile print

# Monitor API logs
tail -f /var/log/wifi-billing/api.log
```

## Security Considerations

1. **API Security**: Use strong passwords for MikroTik API user
2. **Network Isolation**: Separate management and user networks
3. **HTTPS**: Use SSL certificates for production deployment
4. **Rate Limiting**: Prevent payment API abuse
5. **Audit Logging**: Track all user and payment activities

This integration provides a seamless experience where users can purchase internet access directly through mobile money without needing to contact staff or use physical vouchers.