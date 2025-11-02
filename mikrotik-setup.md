# MikroTik Integration Setup

## 1. Configure Hotspot Login Page

```bash
# Set the hotspot login page to redirect to your billing system
/ip hotspot profile set default login-by=http-chap,cookie
/ip hotspot profile set default html-directory=hotspot

# Configure the login page URL to point to your React app
/ip hotspot profile set default http-proxy=192.168.1.100:5176
/ip hotspot profile set default login-by=http-chap
```

## 2. Custom Login Page HTML

Create `/flash/hotspot/login.html` on MikroTik:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WiFi Access</title>
</head>
<body>
    <script>
        // Redirect to your billing system with original URL parameters
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = 'http://192.168.1.100:5176/hotspot-landing?' + params.toString();
        window.location.href = redirectUrl;
    </script>
</body>
</html>
```

## 3. Voucher Authentication

After payment, users get voucher codes that work with MikroTik's user manager:

```bash
# Add voucher user to MikroTik (done via API)
/ip hotspot user add name=VOUCHER123 password=VOUCHER123 profile=1hour
```

## 4. Integration Flow

1. **User connects to WiFi** → MikroTik captive portal activates
2. **MikroTik redirects** → `http://your-server:5176/hotspot-landing`
3. **User selects package** → Makes mobile money payment
4. **System generates voucher** → Creates MikroTik user via API
5. **User gets voucher code** → Enters on MikroTik login form
6. **MikroTik authenticates** → User gets internet access

## 5. URL Parameters

MikroTik passes these parameters to your landing page:

- `dst` - Original destination URL
- `popup` - Whether opened in popup
- `orig-link` - Original link clicked
- `server-name` - Hotspot server name
- `server-address` - Hotspot server IP