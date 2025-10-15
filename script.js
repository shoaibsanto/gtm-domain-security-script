<script>
(function() {
  'use strict';
  
  var allowedDomains = [
    'healthhub.sg',
    'www.healthhub.sg',
    'eservices.healthhub.sg'
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