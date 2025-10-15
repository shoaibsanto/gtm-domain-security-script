# GTM Domain Security Script

A lightweight JavaScript security script that prevents Google Tag Manager (GTM) from executing on unauthorized domains, protecting your tracking implementation from misuse.

## 🎯 Purpose

This script ensures that your GTM container only runs on approved domains, preventing:
- Unauthorized tracking data collection
- GTM container usage on cloned/scraped websites
- Data pollution from test or staging environments
- Potential privacy violations

## ✨ Features

- **Domain Whitelisting** - Only allows GTM execution on specified domains
- **Automatic GTM Disabling** - Neutralizes GTM on unauthorized domains
- **DataLayer Protection** - Prevents dataLayer pushes on blocked domains
- **Alert System** - Optional beacon to log unauthorized usage attempts
- **Zero Dependencies** - Pure vanilla JavaScript
- **Minimal Performance Impact** - Runs once on page load

## 📋 Installation

### 1. Add to GTM Container

1. Go to your GTM workspace
2. Create a new **Custom HTML Tag**
3. Paste the script
4. Set trigger to **All Pages** (or **Page View**)
5. Set **Tag firing priority** to a high number (e.g., 999) to ensure it runs first
6. Publish your container

### 2. Direct Implementation

Alternatively, add directly to your website's `<head>` section **before** the GTM snippet:

```html
<head>
  <!-- GTM Security Script -->
  <script>
    (function() {
      'use strict';
      
      var allowedDomains = [
        'yourdomain.com',
        'www.yourdomain.com',
        'app.yourdomain.com'
      ];
      
      var currentHost = window.location.hostname;
      
      var isAllowed = allowedDomains.some(function(domain) {
        return currentHost === domain || currentHost.endsWith('.' + domain);
      });
      
      if (!isAllowed) {
        console.error('🚫 GTM Blocked on: ' + currentHost);
        
        if (window.google_tag_manager) {
          for (var containerId in window.google_tag_manager) {
            if (window.google_tag_manager.hasOwnProperty(containerId)) {
              window.google_tag_manager[containerId] = {
                dataLayer: {
                  reset: function() {},
                  push: function() { return 0; }
                }
              };
            }
          }
        }
        
        window.dataLayer = [];
        window.dataLayer.push = function() {
          console.warn('⚠️ GTM disabled on unauthorized domain');
          return 0;
        };
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon('https://yourdomain.com/api/gtm-alert', JSON.stringify({
            unauthorizedDomain: currentHost,
            timestamp: new Date().toISOString()
          }));
        }
      } else {
        console.log('✅ GTM Authorized on: ' + currentHost);
      }
    })();
  </script>
  
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXX');</script>
</head>
```

## ⚙️ Configuration

### Allowed Domains

Update the `allowedDomains` array with your authorized domains:

```javascript
var allowedDomains = [
  'yourdomain.com',         // Main domain
  'www.yourdomain.com',     // WWW subdomain
  'app.yourdomain.com',     // Specific subdomain
  'staging.yourdomain.com'
];
```

### Alert Endpoint (Optional)

Configure the beacon endpoint to log unauthorized attempts:

```javascript
navigator.sendBeacon('https://yourdomain.com/api/gtm-alert', JSON.stringify({
  unauthorizedDomain: currentHost,
  timestamp: new Date().toISOString()
}));
```

**Note:** Replace with your actual logging endpoint or remove if not needed.

## 🔍 How It Works

1. **Domain Check** - Compares current hostname against whitelist
2. **GTM Neutralization** - If unauthorized, disables GTM container instances
3. **DataLayer Override** - Replaces dataLayer.push with no-op function
4. **Alert** - Sends notification about unauthorized usage (optional)
5. **Console Logging** - Provides visibility into script execution

## 📊 Console Messages

### Authorized Domain
```
✅ GTM Authorized on: yourdomain.com
```

### Unauthorized Domain
```
🚫 GTM Blocked on: unauthorized-site.com
⚠️ GTM disabled on unauthorized domain
```

## 🛡️ Security Considerations

- **Place Early**: Ensure this script runs before GTM initialization
- **HTTPS Only**: Use HTTPS for alert endpoint
- **Regular Review**: Periodically audit authorized domains
- **Testing**: Test on staging/dev environments before production

## 🧪 Testing

### Test Authorized Domain
1. Deploy script to whitelisted domain
2. Check browser console for `✅ GTM Authorized` message
3. Verify GTM events are firing normally

### Test Unauthorized Domain
1. Access site from non-whitelisted domain or localhost
2. Check console for `🚫 GTM Blocked` message
3. Verify GTM tags are not executing
4. Confirm dataLayer.push attempts are blocked

## 📝 Environment-Specific Setup

### Production Only
```javascript
var allowedDomains = [
  'yourdomain.com',
  'www.yourdomain.com'
];
```

### Production + Staging
```javascript
var allowedDomains = [
  'yourdomain.com',
  'www.yourdomain.com',
  'staging.yourdomain.com'
];
```

### Include All Subdomains
The script automatically includes all subdomains. For example, `yourdomain.com` will match:
- `yourdomain.com`
- `www.yourdomain.com`
- `api.yourdomain.com`
- Any other `*.yourdomain.com`

To block specific subdomains, you'll need to implement exclusion logic.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - feel free to use and modify for your projects.

## ⚠️ Disclaimer

This script provides a layer of protection but should be part of a comprehensive security strategy. Always follow GTM and analytics best practices.

## 🔗 Related Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GTM Security Best Practices](https://support.google.com/tagmanager/answer/9018780)
- [DataLayer Security](https://developers.google.com/tag-platform/tag-manager/datalayer)

---

**Questions or Issues?** Open an issue in this repository or contact your development team.
