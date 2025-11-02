# Customer Setup & Personalization Guide
## Sharif Digital Hub - WiFi Billing System

### 🎯 **Customer Onboarding Flow**

The system now includes a **personalized setup wizard** that customizes the billing system for each customer:

### ✅ **Setup Process**

**Step 1: Business Information**
- Business name (appears in dashboard header)
- Business type (University, Hotel, Cafe, etc.)
- Owner/Manager name
- Contact email and phone

**Step 2: Location Details**
- Country and city
- Full business address
- Timezone configuration

**Step 3: System Configuration**
- Custom system display name
- Currency selection (UGX, KES, USD, etc.)
- Timezone settings

**Step 4: Admin Account Creation**
- Admin email and password
- Setup confirmation and summary

### 🏷️ **Personalization Features**

**Dynamic Branding:**
- Business name in header and sidebar
- Custom system name display
- Business initials as logo
- Personalized login portal

**Customer Configuration:**
- Stored in `localStorage` as `customerConfig`
- Includes license key generation
- Setup completion tracking

### 🚀 **Sales Implementation**

**For Each Customer Sale:**

1. **Provide Setup URL:**
   ```
   https://yourdomain.com/setup
   ```

2. **Customer Completes Setup:**
   - Enters their business information
   - Configures system preferences
   - Creates admin account

3. **System Personalizes:**
   - Dashboard shows customer's business name
   - Login portal branded with their info
   - All interfaces reflect their branding

### 📋 **Customer Data Stored**

```json
{
  "businessName": "Customer Business Name",
  "businessType": "university",
  "ownerName": "Customer Name",
  "email": "customer@email.com",
  "phone": "+256700000000",
  "country": "Uganda",
  "city": "Kampala",
  "address": "Full Address",
  "systemName": "Custom WiFi Portal Name",
  "currency": "UGX",
  "timezone": "Africa/Kampala",
  "adminEmail": "admin@customer.com",
  "setupDate": "2024-01-15T10:30:00Z",
  "licenseKey": "SDH-1705312200000"
}
```

### 🔧 **Technical Implementation**

**Setup Flow:**
1. User visits `/setup` (first time)
2. Completes 4-step wizard
3. Configuration saved to localStorage
4. Redirected to personalized dashboard

**Branding Updates:**
- Header: Shows business name + system name
- Sidebar: Business initials + name
- Login: Branded with customer info
- Footer: Maintains Sharif Digital Hub attribution

### 💼 **Sales Benefits**

**For Customers:**
- Fully branded system with their business name
- Professional appearance for their users
- Custom system naming
- Localized currency and timezone

**For Sharif Digital Hub:**
- Easy customer onboarding
- Automated personalization
- Professional sales presentation
- Scalable deployment model

### 🎯 **Demo Instructions**

**To Test Setup Flow:**
1. Clear localStorage: `localStorage.clear()`
2. Visit: `http://localhost:5173`
3. Will redirect to `/setup`
4. Complete setup wizard
5. See personalized dashboard

**To Reset for New Customer:**
```javascript
localStorage.removeItem('setupComplete');
localStorage.removeItem('customerConfig');
```

The system is now **sales-ready** with complete customer personalization and professional onboarding experience!