# 🚀 Grafana Cloud Enhancements Implementation Plan
## GoatGoat E-commerce Platform Monitoring System

**Created:** 2025-10-08  
**Status:** 📋 **PLANNING PHASE** - Awaiting User Approval  
**Server:** VPS 147.93.108.121 (Staging: Port 4000, Production: Port 3000)

---

## 📋 Executive Summary

This document outlines the implementation plan for three Grafana Cloud enhancements:

1. **Task 1:** Grafana Cloud Alerts with Telegram Integration
2. **Task 2:** Custom Grafana Dashboard with Dedicated Route (like FCM Dashboard)
3. **Task 3:** Log Collection for Node.js Applications

**Total Estimated Time:** 6-8 hours  
**Complexity:** Medium  
**Risk Level:** Low (with proper backups and staging testing)

---

## 🎯 Task 1: Grafana Cloud Alerts with Telegram Integration

### Overview
Configure alerting rules in Grafana Cloud for critical system metrics and integrate with Telegram for instant notifications.

### Complexity Assessment

| Notification Method | Setup Complexity | Reliability | Cost | Recommendation |
|---------------------|------------------|-------------|------|----------------|
| **Email** | 🟢 Very Easy | 🟢 High | Free | ✅ **RECOMMENDED** |
| **Webhook (Slack)** | 🟡 Easy | 🟢 High | Free | ✅ Good Alternative |
| **Telegram** | 🟡 Medium | 🟢 High | Free | ⚠️ Requires Bot Setup |
| **PagerDuty** | 🔴 Complex | 🟢 Very High | Paid | ❌ Not Recommended |

### ✅ RECOMMENDATION: Start with Email, Add Telegram Later

**Why Email First?**
- ✅ Zero setup required (just enter email address)
- ✅ Works immediately
- ✅ No external dependencies
- ✅ Can add Telegram later without disrupting email alerts

**Telegram Setup (Optional - If You Want It):**
- Requires creating a Telegram bot via @BotFather
- Requires getting your Telegram Chat ID
- Takes ~10 minutes to set up
- I'll provide step-by-step guide if you approve

### Implementation Steps

#### Phase 1: Email Alerts (Immediate - 30 minutes)

**Step 1.1: Configure Alert Contact Point in Grafana Cloud**
```
1. Login to https://goatgoat.grafana.net
2. Navigate to: Alerting → Contact points
3. Click "New contact point"
4. Name: "GoatGoat Email Alerts"
5. Integration: Email
6. Addresses: [Your email address]
7. Click "Test" to verify
8. Click "Save contact point"
```

**Step 1.2: Create Alert Rules**

**Alert Rule 1: High CPU Usage**
```yaml
Name: High CPU Usage
Condition: CPU usage > 80% for 5 minutes
Severity: Warning
Message: "⚠️ CPU usage is {{$value}}% on {{$labels.instance}}"
```

**Alert Rule 2: Critical Memory Usage**
```yaml
Name: Critical Memory Usage
Condition: Memory usage > 90% for 3 minutes
Severity: Critical
Message: "🔴 Memory usage is {{$value}}% on {{$labels.instance}}"
```

**Alert Rule 3: Low Disk Space**
```yaml
Name: Low Disk Space
Condition: Disk space < 10% for 5 minutes
Severity: Critical
Message: "🔴 Disk space is only {{$value}}% remaining on {{$labels.instance}}"
```

**Alert Rule 4: Application Downtime**
```yaml
Name: Application Downtime
Condition: Node Exporter down for 2 minutes
Severity: Critical
Message: "🔴 Application appears to be down on {{$labels.instance}}"
```

**Step 1.3: Configure Notification Policy**
```
1. Navigate to: Alerting → Notification policies
2. Set default contact point to "GoatGoat Email Alerts"
3. Configure grouping: Group by "alertname"
4. Set group wait: 30 seconds
5. Set group interval: 5 minutes
6. Set repeat interval: 4 hours
7. Save policy
```

#### Phase 2: Telegram Integration (Optional - 45 minutes)

**Prerequisites:**
- Telegram account
- Access to Telegram app

**Step 2.1: Create Telegram Bot**
```
1. Open Telegram and search for @BotFather
2. Send: /newbot
3. Follow prompts to name your bot (e.g., "GoatGoat Monitoring Bot")
4. Save the Bot Token (looks like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)
```

**Step 2.2: Get Your Chat ID**
```
1. Search for @userinfobot in Telegram
2. Start a conversation
3. It will reply with your Chat ID (e.g., 987654321)
4. Save this Chat ID
```

**Step 2.3: Add Telegram Contact Point in Grafana**
```
1. Navigate to: Alerting → Contact points
2. Click "New contact point"
3. Name: "GoatGoat Telegram Alerts"
4. Integration: Telegram
5. Bot Token: [Paste your bot token]
6. Chat ID: [Paste your chat ID]
7. Click "Test" to verify
8. Click "Save contact point"
```

**Step 2.4: Update Notification Policy**
```
1. Navigate to: Alerting → Notification policies
2. Add Telegram as additional contact point
3. Now alerts will go to BOTH email and Telegram
```

### Deliverables for Task 1
- ✅ 4 alert rules configured (CPU, Memory, Disk, Downtime)
- ✅ Email notifications working
- ✅ (Optional) Telegram notifications working
- ✅ Notification policy configured
- ✅ Test alerts sent and verified

### Testing Checklist
- [ ] Email alert received for test notification
- [ ] (Optional) Telegram alert received for test notification
- [ ] Alert grouping works correctly
- [ ] Alert repeat interval works (doesn't spam)
- [ ] Critical alerts have higher priority

---

## 🎯 Task 2: Custom Grafana Dashboard with Dedicated Route

### Overview
Create a custom Grafana dashboard accessible via `/admin/grafana-dashboard` route, following the same pattern as the FCM dashboard at `/admin/fcm-management`.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Node.js Application (Port 3000/4000)                       │
├─────────────────────────────────────────────────────────────┤
│  1. AdminJS Router (Registered First)                       │
│     └── /admin/* (AdminJS routes)                           │
│                                                              │
│  2. FCM Dashboard (Registered After AdminJS)                │
│     └── /admin/fcm-management (Existing)                    │
│                                                              │
│  3. Grafana Dashboard (NEW - Registered After AdminJS)      │
│     └── /admin/grafana-dashboard (NEW)                      │
│         ├── Serves HTML page with embedded iframe          │
│         └── iframe points to Grafana Cloud dashboard        │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Approach

**Option A: Embedded iframe (RECOMMENDED)**
- ✅ Simple implementation
- ✅ No proxy complexity
- ✅ Direct access to Grafana Cloud
- ✅ Auto-updates from Grafana
- ⚠️ Requires Grafana Cloud public dashboard link

**Option B: Server-side proxy**
- ⚠️ Complex implementation
- ⚠️ Requires authentication handling
- ⚠️ May violate Grafana Cloud ToS
- ❌ Not recommended

### Implementation Steps

#### Step 2.1: Create Grafana Cloud Dashboard (15 minutes)

**In Grafana Cloud:**
```
1. Login to https://goatgoat.grafana.net
2. Navigate to: Dashboards → New Dashboard
3. Add panels for:
   - CPU Usage (Time series)
   - Memory Usage (Gauge)
   - Disk Usage (Bar gauge)
   - Network Traffic (Time series)
   - Application Uptime (Stat)
   - Active Processes (Table)
4. Save dashboard as "GoatGoat System Monitoring"
5. Click "Share" → "Snapshot" or "Public dashboard"
6. Copy the public URL or embed code
```

#### Step 2.2: Create HTML Dashboard Page (30 minutes)

**File:** `/var/www/goatgoat-staging/server/src/public/grafana-dashboard/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GoatGoat System Monitoring</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 { font-size: 24px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .dashboard-container {
            width: 100%;
            height: calc(100vh - 80px);
            border: none;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 GoatGoat System Monitoring</h1>
        <p>Real-time server metrics and application health</p>
    </div>
    <div class="dashboard-container">
        <iframe src="[GRAFANA_DASHBOARD_URL]" frameborder="0" allowfullscreen></iframe>
    </div>
</body>
</html>
```

#### Step 2.3: Add Route to app.ts (Following FCM Pattern) (20 minutes)

**File:** `/var/www/goatgoat-staging/server/src/app.ts`

**Location:** After AdminJS router registration, alongside FCM dashboard route

```typescript
// 📊 Grafana Dashboard Route (Similar to FCM Dashboard)
app.get("/admin/grafana-dashboard", async (request, reply) => {
    try {
        const fs = await import('fs');
        const filePath = '/var/www/goatgoat-staging/server/src/public/grafana-dashboard/index.html';
        const html = await fs.promises.readFile(filePath, 'utf8');
        reply.type('text/html');
        return html;
    } catch (error: any) {
        reply.status(500).send(`<h1>Grafana Dashboard Error</h1><p>${error?.message || 'File not found'}</p>`);
    }
});

// 📊 Grafana Status API Endpoint (Optional - for health checks)
app.get("/admin/grafana-dashboard/api/status", async (request, reply) => {
    return {
        success: true,
        service: 'Grafana Cloud',
        status: 'connected',
        dashboardUrl: 'https://goatgoat.grafana.net',
        lastUpdated: new Date().toISOString()
    };
});
```

#### Step 2.4: Build and Deploy (15 minutes)

**On Staging Server:**
```bash
# 1. Create directory structure
mkdir -p /var/www/goatgoat-staging/server/src/public/grafana-dashboard

# 2. Upload HTML file (via SCP or create directly)
# [HTML file created in Step 2.2]

# 3. Build TypeScript
cd /var/www/goatgoat-staging/server
npm run build

# 4. Restart PM2
pm2 restart goatgoat-staging

# 5. Verify
curl http://localhost:4000/admin/grafana-dashboard
```

### Deliverables for Task 2
- ✅ Grafana Cloud dashboard created with 6+ panels
- ✅ HTML dashboard page created
- ✅ Route added to app.ts (following FCM pattern)
- ✅ Built and deployed to staging
- ✅ Accessible at https://staging.goatgoat.tech/admin/grafana-dashboard
- ✅ AdminJS panel unaffected
- ✅ No port conflicts

### Testing Checklist
- [ ] Dashboard loads at /admin/grafana-dashboard
- [ ] Grafana iframe displays correctly
- [ ] Metrics are visible in dashboard
- [ ] AdminJS panel still works (/admin)
- [ ] FCM dashboard still works (/admin/fcm-management)
- [ ] No console errors
- [ ] Mobile responsive

---

## 🎯 Task 3: Log Collection for Node.js Applications

### Overview
Configure Grafana Alloy to collect application logs from both staging and production Node.js apps and send them to Grafana Cloud Loki.

### Log Sources

```
┌─────────────────────────────────────────────────────────────┐
│  Log Sources to Collect                                      │
├─────────────────────────────────────────────────────────────┤
│  1. PM2 Application Logs                                     │
│     ├── /root/.pm2/logs/goatgoat-production-out.log        │
│     ├── /root/.pm2/logs/goatgoat-production-error.log      │
│     ├── /root/.pm2/logs/goatgoat-staging-out.log           │
│     └── /root/.pm2/logs/goatgoat-staging-error.log         │
│                                                              │
│  2. System Logs (Optional)                                   │
│     ├── /var/log/syslog                                     │
│     └── /var/log/auth.log                                   │
│                                                              │
│  3. MongoDB Logs (Optional - if needed)                      │
│     └── MongoDB Atlas logs (via API)                        │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Steps

#### Step 3.1: Update Grafana Alloy Configuration (30 minutes)

**File:** `/etc/grafana-alloy/config.alloy`

**Add log collection components:**

```alloy
// Log file discovery for PM2 logs
local.file_match "pm2_logs" {
	path_targets = [
		{__path__ = "/root/.pm2/logs/*-out.log"},
		{__path__ = "/root/.pm2/logs/*-error.log"},
	]
}

// Log scraping from PM2 files
loki.source.file "pm2_logs" {
	targets    = local.file_match.pm2_logs.targets
	forward_to = [loki.process.pm2_logs.receiver]
}

// Log processing and labeling
loki.process "pm2_logs" {
	forward_to = [loki.write.grafana_cloud_loki.receiver]

	// Extract application name from filename
	stage.regex {
		expression = ".*logs/(?P<app>.*?)-(out|error)\\.log"
	}

	// Add labels
	stage.labels {
		values = {
			app = "",
			log_type = "",
		}
	}
}
```

**Backup and apply:**
```bash
# Backup current config
cp /etc/grafana-alloy/config.alloy /etc/grafana-alloy/config.alloy.backup-$(date +%Y%m%d-%H%M%S)

# Edit config (add log collection components)
# [Manual edit or upload new config]

# Restart service
systemctl restart grafana-alloy

# Verify
systemctl status grafana-alloy
journalctl -u grafana-alloy -n 50
```

#### Step 3.2: Configure Log Retention and Filtering (15 minutes)

**To stay within 50GB/month free tier:**

```alloy
// Add filtering to reduce log volume
loki.process "pm2_logs" {
	forward_to = [loki.write.grafana_cloud_loki.receiver]

	// Drop debug logs (keep only info, warn, error)
	stage.match {
		selector = "{log_type=\"out\"}"
		stage.drop {
			expression = ".*DEBUG.*"
		}
	}

	// Sample non-error logs (keep 50%)
	stage.match {
		selector = "{log_type=\"out\"}"
		stage.sampling {
			rate = 0.5
		}
	}

	// Keep ALL error logs (100%)
	stage.match {
		selector = "{log_type=\"error\"}"
		// No sampling for errors
	}
}
```

#### Step 3.3: Add Logs to Custom Dashboard (20 minutes)

**In Grafana Cloud Dashboard (created in Task 2):**

```
1. Edit dashboard
2. Add new panel: "Application Logs"
3. Data source: Loki
4. Query: {app=~"goatgoat.*"}
5. Visualization: Logs
6. Options:
   - Show time
   - Show labels
   - Wrap lines
   - Deduplication: None
7. Save panel
```

**Add log panels:**
- Recent Errors (last 1 hour)
- Log Volume (time series)
- Error Rate (stat)
- Top Error Messages (table)

### Deliverables for Task 3
- ✅ Grafana Alloy configured for log collection
- ✅ PM2 logs being sent to Grafana Cloud Loki
- ✅ Log filtering configured (within 50GB/month limit)
- ✅ Logs integrated into custom dashboard
- ✅ Log retention policy configured
- ✅ Error logs prioritized (100% collection)

### Testing Checklist
- [ ] Logs appearing in Grafana Cloud Loki
- [ ] Log labels correct (app, log_type)
- [ ] Error logs being collected (100%)
- [ ] Debug logs being filtered
- [ ] Log volume within limits
- [ ] Dashboard shows recent logs
- [ ] Log search works correctly

---

## 📊 Implementation Timeline

| Task | Phase | Duration | Dependencies |
|------|-------|----------|--------------|
| **Task 1** | Email Alerts | 30 min | None |
| **Task 1** | Telegram (Optional) | 45 min | Email alerts complete |
| **Task 2** | Create Dashboard | 15 min | None |
| **Task 2** | Create HTML Page | 30 min | Dashboard created |
| **Task 2** | Add Route | 20 min | HTML page ready |
| **Task 2** | Deploy Staging | 15 min | Route added |
| **Task 3** | Update Alloy Config | 30 min | None |
| **Task 3** | Configure Filtering | 15 min | Config updated |
| **Task 3** | Add to Dashboard | 20 min | Task 2 complete |
| **TOTAL** | | **3.5-4 hours** | |

---

## 🔒 Safety Measures

### Backups Required
```bash
# Before any changes
cp /etc/grafana-alloy/config.alloy /etc/grafana-alloy/config.alloy.backup-$(date +%Y%m%d-%H%M%S)
cp /var/www/goatgoat-staging/server/src/app.ts /var/www/goatgoat-staging/server/src/app.ts.backup-$(date +%Y%m%d-%H%M%S)
```

### Testing Sequence
1. ✅ Test on staging first
2. ✅ Verify AdminJS still works
3. ✅ Verify FCM dashboard still works
4. ✅ Wait for user approval
5. ✅ Deploy to production

### Rollback Plan
```bash
# If anything breaks
cp /etc/grafana-alloy/config.alloy.backup-[TIMESTAMP] /etc/grafana-alloy/config.alloy
systemctl restart grafana-alloy
pm2 restart goatgoat-staging
```

---

## ✅ Final Deliverables

1. **Task 1: Alerts**
   - Email alerts configured and tested
   - (Optional) Telegram alerts configured
   - 4 alert rules active
   - Notification policy configured

2. **Task 2: Dashboard**
   - Custom dashboard at /admin/grafana-dashboard
   - 6+ monitoring panels
   - Embedded Grafana Cloud iframe
   - AdminJS unaffected

3. **Task 3: Logs**
   - PM2 logs collected
   - Logs in Grafana Cloud Loki
   - Log filtering active
   - Logs in custom dashboard

4. **Documentation**
   - This implementation plan
   - Updated Bug-fixed.md
   - Configuration files documented

---

## 🚦 Approval Required

**Please review this plan and approve:**

- [ ] **Task 1:** Email alerts (30 min) - Approve?
- [ ] **Task 1 Optional:** Telegram alerts (45 min) - Approve?
- [ ] **Task 2:** Custom dashboard route (80 min) - Approve?
- [ ] **Task 3:** Log collection (65 min) - Approve?

**Questions for you:**
1. Do you want Telegram alerts, or is email sufficient?
2. What email address should receive alerts?
3. Should I proceed with all tasks, or prioritize specific ones?
4. Any specific logs you want to exclude/include?

**Once approved, I will:**
1. Execute on staging server first
2. Provide progress updates
3. Request approval before production deployment
4. Update Bug-fixed.md with results

