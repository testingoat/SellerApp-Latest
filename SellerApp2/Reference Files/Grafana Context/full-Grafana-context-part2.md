# Full Grafana Context - Part 2 (Continued)

## 💻 Code Snippets (Continued)

### 2. App.js Integration

**File:** `/var/www/goatgoat-production/server/dist/app.js`

```javascript
// Register logs stream routes (added after FCM API endpoints)
const logsStreamModule = await import('./routes/logs-stream.js');
await app.register(logsStreamModule.default);
console.log('✅ Logs stream routes registered successfully');
```

### 3. Grafana Alloy Configuration

**File:** `/etc/grafana-alloy/config.alloy`

```hcl
// Loki configuration for log collection
loki.write "grafana_cloud_loki" {
  endpoint {
    url = "https://logs-prod-012.grafana.net/loki/api/v1/push"
    basic_auth {
      username = "1234567"
      password = "glc_eyJvIjoiMTI..."
    }
  }
}

// PM2 log collection
local.file_match "pm2_logs" {
  path_targets = [
    {
      __path__ = "/var/www/goatgoat-production/server/logs/📄-production-output.log",
      job = "pm2-logs",
      app = "goatgoat-production",
      log_type = "stdout"
    },
    {
      __path__ = "/var/www/goatgoat-production/server/logs/🚨-production-error.log",
      job = "pm2-logs",
      app = "goatgoat-production",
      log_type = "stderr"
    },
    {
      __path__ = "/var/www/goatgoat-staging/server/logs/📄-staging-output.log",
      job = "pm2-logs",
      app = "goatgoat-staging",
      log_type = "stdout"
    },
    {
      __path__ = "/var/www/goatgoat-staging/server/logs/🚨-staging-error.log",
      job = "pm2-logs",
      app = "goatgoat-staging",
      log_type = "stderr"
    }
  ]
}

// Log processing with filtering
loki.process "pm2_logs" {
  forward_to = [loki.write.grafana_cloud_loki.receiver]

  stage.match {
    selector = "{log_type=\"stderr\"}"
    stage.sampling {
      rate = 1.0  // 100% of error logs
    }
  }

  stage.match {
    selector = "{log_type=\"stdout\"} |~ \"(?i)(info|success)\""
    stage.sampling {
      rate = 0.5  // 50% of info logs
    }
  }

  stage.match {
    selector = "{log_type=\"stdout\"} |~ \"(?i)debug\""
    stage.sampling {
      rate = 0.0  // 0% of debug logs (drop all)
    }
  }
}

loki.source.file "pm2_logs" {
  targets    = local.file_match.pm2_logs.targets
  forward_to = [loki.process.pm2_logs.receiver]
}
```

### 4. PowerShell Script to Update Grafana Dashboard

**File:** `update-dashboard-with-better-config.ps1`

```powershell
$apiKey = "glsa_Mt0mQ...zOpnOWougZdVs_e7151fef"
$dashboardUid = "f3ee8022-12b2-4ddf-a8d5-e53fdd8ae81c"

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
}

# Get existing dashboard
$getDashboardUrl = "https://goatgoat.grafana.net/api/dashboards/uid/$dashboardUid"
$response = Invoke-RestMethod -Uri $getDashboardUrl -Headers $headers -Method Get

# Update time range to 24 hours
$dashboard = $response.dashboard
$dashboard.time = @{
    from = "now-24h"
    to = "now"
}

# Update dashboard
$updatePayload = @{
    dashboard = $dashboard
    overwrite = $true
} | ConvertTo-Json -Depth 100

$updateUrl = "https://goatgoat.grafana.net/api/dashboards/db"
Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method Post -Body $updatePayload
```

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Grafana Cloud    │  │ Custom Log       │  │ Admin Panel   │ │
│  │ Dashboard        │  │ Viewer           │  │ Dashboard     │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nginx Reverse Proxy                        │
│                    (staging.goatgoat.tech)                      │
│                    (goatgoat.tech)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│  Production Server        │   │  Staging Server           │
│  Port 3000                │   │  Port 4000                │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │ Fastify App         │  │   │  │ Fastify App         │  │
│  │ ┌─────────────────┐ │  │   │  │ ┌─────────────────┐ │  │
│  │ │ /logs-viewer    │ │  │   │  │ │ /logs-viewer    │ │  │
│  │ │ /api/logs       │ │  │   │  │ │ /api/logs       │ │  │
│  │ │ /admin/grafana  │ │  │   │  │ │ /admin/grafana  │ │  │
│  │ └─────────────────┘ │  │   │  │ └─────────────────┘ │  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │
│  ┌─────────────────────┐  │   │  ┌─────────────────────┐  │
│  │ PM2 Logs            │  │   │  │ PM2 Logs            │  │
│  │ - output.log        │  │   │  │ - output.log        │  │
│  │ - error.log         │  │   │  │ - error.log         │  │
│  └─────────────────────┘  │   │  └─────────────────────┘  │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │  Grafana Alloy Agent    │
                │  - Collects logs        │
                │  - Collects metrics     │
                │  - Filters & processes  │
                └─────────────────────────┘
                              │
                              │ HTTPS
                              ▼
                ┌─────────────────────────┐
                │   Grafana Cloud         │
                │   ┌─────────────────┐   │
                │   │ Loki (Logs)     │   │
                │   └─────────────────┘   │
                │   ┌─────────────────┐   │
                │   │ Prometheus      │   │
                │   │ (Metrics)       │   │
                │   └─────────────────┘   │
                └─────────────────────────┘
```

---

## 🔧 Troubleshooting

### Issue 1: "No data" in Grafana Dashboard Panels

**Symptoms:**
- Grafana panels show "No data"
- Logs exist in files but not visible in dashboard

**Causes:**
1. Time range too narrow (e.g., "Last 6 hours" but logs are older)
2. Grafana Alloy service not running
3. Log files not being read by Alloy
4. Incorrect Loki datasource configuration

**Solutions:**
1. Increase time range to 24 hours or more
2. Check Alloy service: `systemctl status grafana-alloy`
3. Check Alloy logs: `journalctl -u grafana-alloy -n 50`
4. Verify log file permissions: `ls -la /var/www/*/server/logs/`
5. Test Loki query in Grafana Explore: `{job="pm2-logs"}`

### Issue 2: Authentication Popup Not Appearing

**Symptoms:**
- Accessing `/logs-viewer` doesn't show login popup
- Getting 401 error without authentication prompt

**Causes:**
1. Browser cached old response
2. Authentication middleware not registered
3. Server not restarted after code changes

**Solutions:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Check server logs: `pm2 logs goatgoat-production --lines 20`
4. Restart server: `pm2 restart goatgoat-production`
5. Verify route registration in logs: Look for "✅ Logs stream routes registered successfully"

### Issue 3: Logs Not Updating in Real-Time

**Symptoms:**
- Log viewer shows old logs
- Auto-refresh not working

**Causes:**
1. JavaScript error in browser console
2. API endpoint returning cached data
3. Log files not being written to

**Solutions:**
1. Open browser console (F12) and check for errors
2. Verify API endpoint: `curl -u admin:GoatGoat@2025 http://147.93.108.121:3000/api/logs`
3. Check if PM2 is writing logs: `tail -f /var/www/goatgoat-production/server/logs/*.log`
4. Restart PM2: `pm2 restart all`

### Issue 4: "Live Logs" Button Not Working

**Symptoms:**
- Clicking "Live Logs" button does nothing
- Button redirects to wrong URL

**Causes:**
1. HTML file not updated on server
2. Nginx not serving updated file
3. Browser cache

**Solutions:**
1. Verify HTML file: `cat /var/www/goatgoat-staging/server/src/public/grafana-dashboard/index.html | grep "Live Logs"`
2. Clear browser cache
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 💡 Future Recommendations

### 1. Enhanced Security
- [ ] Move credentials to environment variables
- [ ] Implement JWT-based authentication instead of Basic Auth
- [ ] Add rate limiting to API endpoints
- [ ] Enable HTTPS for direct IP access
- [ ] Add IP whitelisting for log viewer access

### 2. Advanced Features
- [ ] Add log search functionality (grep-like)
- [ ] Implement log export to CSV/JSON
- [ ] Add log filtering by date range
- [ ] Create custom Grafana alerts for critical errors
- [ ] Add webhook notifications for errors
- [ ] Implement log archiving (compress old logs)

### 3. Performance Optimization
- [ ] Implement log pagination for large files
- [ ] Add caching layer for frequently accessed logs
- [ ] Use WebSocket for real-time log streaming (instead of polling)
- [ ] Compress logs before sending to browser
- [ ] Implement lazy loading for log viewer

### 4. Monitoring Enhancements
- [ ] Add application-level metrics (request count, response time)
- [ ] Create custom Grafana dashboard for business metrics
- [ ] Implement distributed tracing (Jaeger/Zipkin)
- [ ] Add database query performance monitoring
- [ ] Create SLA/SLO dashboards

### 5. User Experience
- [ ] Add dark/light theme toggle
- [ ] Implement log syntax highlighting
- [ ] Add keyboard shortcuts for log viewer
- [ ] Create mobile app for monitoring
- [ ] Add email digest of daily errors

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- Check Grafana dashboard for anomalies
- Review error logs for critical issues

**Weekly:**
- Verify Grafana Alloy service is running
- Check disk space for log files
- Review authentication logs

**Monthly:**
- Update Grafana Alloy to latest version
- Review and optimize log filtering rules
- Archive old logs (>30 days)
- Review Grafana Cloud usage (free tier limits)

### Useful Commands

```bash
# Check Grafana Alloy status
systemctl status grafana-alloy

# View Alloy logs
journalctl -u grafana-alloy -n 100 --no-pager

# Restart Alloy
systemctl restart grafana-alloy

# Check PM2 logs
pm2 logs --lines 50

# Restart production server
pm2 restart goatgoat-production

# Check log file sizes
du -sh /var/www/*/server/logs/*.log

# Compress old logs
gzip /var/www/goatgoat-production/server/logs/*.log.old

# Test log viewer API
curl -u admin:GoatGoat@2025 "http://localhost:3000/api/logs?env=production&type=output&lines=5"
```

---

## 📝 Change Log

### October 9, 2025
- ✅ Created Grafana Cloud dashboard with 6 panels
- ✅ Installed and configured Grafana Alloy
- ✅ Implemented custom log streaming viewer
- ✅ Added HTTP Basic Authentication
- ✅ Integrated "Live Logs" button into Grafana dashboard page
- ✅ Deployed to both production and staging servers
- ✅ Updated Bug-fixed.md documentation
- ✅ Created full-Grafana-context.md documentation

---

## 🎓 Learning Resources

- [Grafana Cloud Documentation](https://grafana.com/docs/grafana-cloud/)
- [Grafana Alloy Documentation](https://grafana.com/docs/alloy/latest/)
- [Loki LogQL Documentation](https://grafana.com/docs/loki/latest/logql/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

**End of Documentation**

*For questions or issues, refer to the troubleshooting section or contact the development team.*

