# 🔧 Grafana Installation Diagnosis & Fix Report
## GoatGoat VPS Server (147.93.108.121)

**Created:** 2025-10-08  
**Server:** 147.93.108.121 (Staging: Port 4000, Production: Port 3000)  
**Status:** ⚠️ PARTIALLY WORKING - Requires Configuration Fix

---

## 📊 Executive Summary

### Current State
- ✅ **Grafana Cloud Account:** Active and configured
- ✅ **Node Exporter:** Installed and running (port 9100)
- ✅ **Grafana Alloy Binary:** Installed at `/usr/local/bin/alloy`
- ❌ **Grafana Alloy Service:** FAILED - Configuration syntax errors
- ⚠️ **Data Collection:** NOT WORKING - Alloy service is down

### Root Cause
**Configuration file syntax errors** - The `/etc/grafana-alloy/config.alloy` file has malformed quotes and escape characters, preventing the Alloy service from starting.

---

## 🔍 Detailed Diagnosis

### 1. ✅ What's Working

#### A. Grafana Cloud Integration
```
Organization: goatgoat
Stack ID: 1399459
Access Token: Active (last used 3 minutes ago per screenshot)
```

**Endpoints Configured:**
- Metrics: `https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push`
- Logs: `https://logs-prod-028.grafana.net/loki/api/v1/push`
- Fleet Management: `https://fleet-management-prod-018.grafana.net`

#### B. Node Exporter (System Metrics Collector)
```bash
Service: prometheus-node-exporter.service
Status: ✅ active (running) since 15:11:02 UTC
Port: 9100 (listening on IPv6)
PID: 542155
Memory: 5.7M
```

**Verification:**
```bash
$ ps aux | grep node-exporter
prometh+  542155  0.0  0.2 1013676 10004 ?  Ssl  15:11  0:00 /usr/bin/prometheus-node-exporter
```

#### C. Grafana Alloy Binary
```bash
Location: /usr/local/bin/alloy
Version: Installed (binary exists)
```

#### D. Port Allocation (No Conflicts)
```
Port 3000: ✅ Production app (PM2)
Port 4000: ✅ Staging app (PM2)
Port 9100: ✅ Node Exporter
Port 12345: ⚠️ Reserved for Alloy (not running)
```

**No port conflicts detected** - Your concern about port 3001 is not relevant here.

---

### 2. ❌ What's Broken

#### A. Grafana Alloy Service
```bash
Service: grafana-alloy.service
Status: ❌ inactive (dead) - exit code 1
Last Attempt: 16:27:00 UTC
Error: Configuration syntax errors
```

**Service Definition:**
```
Location: /etc/systemd/system/grafana-alloy.service
ExecStart: /usr/local/bin/alloy run /etc/grafana-alloy/config.alloy --server.http.listen-addr=0.0.0.0:12345
```

#### B. Configuration File Errors

**File:** `/etc/grafana-alloy/config.alloy`

**Problem:** Malformed escape sequences and quotes

**Current (Broken) Content:**
```alloy
remotecfg {
url            = " https://fleet-management-prod-018.grafana.net\
id = \srv1007003\
poll_frequency = \60s\

basic_auth {
username = \1399459\
password = sys.env(\GCLOUD_RW_API_KEY\)
}
}

prometheus.remote_write \metrics_service\ {
endpoint {
url = \https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push\
...
```

**Errors Detected:**
1. ❌ Backslashes (`\`) instead of quotes (`"`)
2. ❌ Malformed string literals
3. ❌ Illegal character U+005C '\' in component names
4. ❌ Missing proper quote delimiters

**Error Log:**
```
Oct 08 16:26:57 srv1007003 alloy[551678]: Error: /etc/grafana-alloy/config.alloy:52:19: illegal character U+005C '\'
Oct 08 16:26:57 srv1007003 alloy[551678]: 52 | prometheus.scrape \integrations_node_exporter\ {
Oct 08 16:26:57 srv1007003 alloy[551678]:    |                   ^
```

---

### 3. ⚠️ Impact Assessment

#### Data Collection Status
```
System Metrics: ❌ NOT being sent to Grafana Cloud
Application Logs: ❌ NOT being sent to Grafana Cloud
Dashboards: ⚠️ Show "No data" (as seen in screenshots)
Alerts: ❌ Cannot be configured without data
```

#### Why Dashboards Show "No Data"
From your screenshots, the Grafana Cloud dashboards exist but show "No data" because:
1. Grafana Alloy service is not running
2. Node Exporter metrics are not being scraped
3. No data is being forwarded to Grafana Cloud

---

## 🛠️ Root Cause Analysis

### How Did This Happen?

Based on the conversation log (`grafana.txt`), the installation process encountered **shell escaping issues** when trying to create the configuration file remotely via SSH:

1. **Initial Setup:** Grafana Cloud integration was configured successfully
2. **Node Exporter Addition:** Attempted to add Node Exporter configuration
3. **SSH Escaping Issues:** Multiple attempts to write config file via SSH failed due to:
   - PowerShell vs Bash quote handling differences
   - Heredoc syntax issues
   - Escape character conflicts

**Attempted Methods (All Failed):**
- `cat > file << EOF` with various quote combinations
- `echo` with escaped quotes
- `tee` command
- Python script with triple-escaped quotes

**Result:** Configuration file was created with malformed syntax

---

## 🎯 Remediation Plan

### Option A: Fix Existing Installation (Recommended)

**Estimated Time:** 15 minutes  
**Risk Level:** 🟢 Low  
**Approach:** Fix the configuration file syntax and restart the service

#### Steps:

1. **Create Backup**
   ```bash
   ssh root@147.93.108.121 "cp /etc/grafana-alloy/config.alloy /etc/grafana-alloy/config.alloy.broken-$(date +%Y%m%d-%H%M%S)"
   ```

2. **Upload Correct Configuration**
   - Create correct config file locally
   - Upload via SCP or direct file edit on server

3. **Verify Configuration**
   ```bash
   ssh root@147.93.108.121 "/usr/local/bin/alloy run /etc/grafana-alloy/config.alloy --dry-run"
   ```

4. **Restart Service**
   ```bash
   ssh root@147.93.108.121 "systemctl restart grafana-alloy"
   ssh root@147.93.108.121 "systemctl status grafana-alloy"
   ```

5. **Verify Data Flow**
   - Check Grafana Cloud dashboards (wait 1-2 minutes)
   - Verify metrics are appearing

---

### Option B: Clean Reinstall (If Option A Fails)

**Estimated Time:** 30 minutes  
**Risk Level:** 🟡 Medium  
**Approach:** Remove and reinstall Grafana Alloy with fresh configuration

#### Steps:

1. **Stop and Disable Service**
   ```bash
   systemctl stop grafana-alloy
   systemctl disable grafana-alloy
   ```

2. **Remove Existing Installation**
   ```bash
   rm -rf /etc/grafana-alloy
   rm -f /usr/local/bin/alloy
   rm -f /etc/systemd/system/grafana-alloy.service
   systemctl daemon-reload
   ```

3. **Reinstall Using Grafana Cloud UI**
   - Go to Grafana Cloud → Connections → Add Integration
   - Select "Linux Server"
   - Copy the installation command
   - Run on server

4. **Verify Installation**
   - Check service status
   - Verify data in dashboards

---

## 📋 Correct Configuration File

### Working `config.alloy` Template

```alloy
remotecfg {
	url            = "https://fleet-management-prod-018.grafana.net"
	id             = "srv1007003"
	poll_frequency = "60s"

	basic_auth {
		username = "1399459"
		password = sys.env("GCLOUD_RW_API_KEY")
	}
}

prometheus.remote_write "metrics_service" {
	endpoint {
		url = "https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push"

		basic_auth {
			username = "2723153"
			password = sys.env("GCLOUD_RW_API_KEY")
		}
	}
}

loki.write "grafana_cloud_loki" {
	endpoint {
		url = "https://logs-prod-028.grafana.net/loki/api/v1/push"

		basic_auth {
			username = "1357253"
			password = sys.env("GCLOUD_RW_API_KEY")
		}
	}
}

prometheus.exporter.unix "integrations_node_exporter" {
	disable_collectors = ["ipvs", "btrfs", "infiniband", "xfs", "zfs"]
}

discovery.relabel "integrations_node_exporter" {
	targets = prometheus.exporter.unix.integrations_node_exporter.targets

	rule {
		target_label = "instance"
		replacement  = constants.hostname
	}

	rule {
		target_label = "job"
		replacement  = "integrations/node_exporter"
	}
}

prometheus.scrape "integrations_node_exporter" {
	targets    = discovery.relabel.integrations_node_exporter.output
	forward_to = [prometheus.remote_write.metrics_service.receiver]
}
```

**Key Differences from Broken Version:**
- ✅ Proper double quotes (`"`) around strings
- ✅ No backslash escape characters
- ✅ Correct component name syntax
- ✅ Proper indentation with tabs

---

## 🔐 Environment Variables Required

The configuration uses an environment variable that must be set:

```bash
GCLOUD_RW_API_KEY=glc_eyJvIjoiMTA5OTMyNyIsIm4iOiJzdGFjay0xMzk5NDU5LWFsbG95LWdyYWZhbmEtYWxsb3kiLCJrIjoiZllBdnhOcWhlNDBHSzNiUGJjUTg4VDBkIiwibSI6eyJyIjoicHJvZC1hcC1zb3V0aC0xIn19
```

**This should be set in:**
- `/etc/systemd/system/grafana-alloy.service` (Environment= directive)
- OR `/etc/default/grafana-alloy` (sourced by service)

---

## ✅ Verification Checklist

After applying the fix, verify:

- [ ] Grafana Alloy service is running: `systemctl status grafana-alloy`
- [ ] No errors in logs: `journalctl -u grafana-alloy -n 50`
- [ ] Alloy is listening on port 12345: `netstat -tulpn | grep 12345`
- [ ] Node Exporter metrics are being scraped (check Alloy logs)
- [ ] Data appears in Grafana Cloud dashboards (wait 1-2 minutes)
- [ ] "Linux node / CPU and system" dashboard shows data
- [ ] No port conflicts with existing services (3000, 4000)

---

## 🚨 Important Notes

### 1. No AdminJS Interference
✅ **Confirmed:** This Grafana setup does NOT interfere with AdminJS:
- Grafana Alloy runs as a separate systemd service
- Uses port 12345 (not 3000 or 4000)
- No web UI on the server (cloud-based)
- No modifications to your Node.js application

### 2. No Port Conflicts
✅ **Confirmed:** No conflicts with your existing services:
```
Port 3000: Production app (untouched)
Port 4000: Staging app (untouched)
Port 9100: Node Exporter (separate service)
Port 12345: Grafana Alloy (when running)
```

### 3. Follows FCM Dashboard Pattern
✅ **Similar Integration Approach:**
- Separate service (like FCM runs in Node.js app)
- No code changes to main application
- Cloud-based UI (like FCM dashboard is local HTML)
- API-based data collection

**Key Difference:** Grafana is completely external - no routes added to your app.

---

## 📊 Expected Outcome After Fix

### Grafana Cloud Dashboards
You should see data in these dashboards:
1. **Linux node / CPU and system** - CPU, memory, disk usage
2. **Linux node / filesystem and disks** - Disk I/O, filesystem metrics
3. **Linux node / heat overview** - System heatmaps
4. **Linux node / logs** - System logs (if log collection enabled)
5. **Linux node / memory** - Detailed memory metrics
6. **Linux node / network** - Network traffic and errors

### Metrics Available
- CPU usage by core
- Memory usage (total, available, cached)
- Disk I/O (read/write bytes, operations)
- Network traffic (bytes in/out, errors)
- System load average
- Process counts
- File descriptor usage

---

## 🎯 Next Steps (Awaiting Your Approval)

**I recommend Option A: Fix Existing Installation**

### What I Need From You:

1. **Approval to proceed** with fixing the configuration
2. **Confirmation:** Should I create a backup before making changes? (Recommended: Yes)
3. **Preference:** Would you like me to:
   - Fix it directly via SSH, OR
   - Provide you with the exact commands to run manually?

### Timeline:
- **Diagnosis:** ✅ Complete
- **Fix Implementation:** ⏸️ Awaiting approval
- **Verification:** 5 minutes after fix
- **Total Time:** ~20 minutes from approval

---

## 📝 Summary

**Problem:** Grafana Alloy configuration file has syntax errors due to SSH escaping issues during remote file creation.

**Impact:** No metrics are being sent to Grafana Cloud, dashboards show "No data".

**Solution:** Replace the malformed configuration file with a correctly formatted one.

**Risk:** 🟢 Low - Simple configuration file replacement, no code changes.

**Recommendation:** Proceed with Option A (fix existing installation).

---

**Status:** ⏸️ Awaiting your approval to proceed with the fix  
**Last Updated:** 2025-10-08 16:37 UTC  
**Diagnosed By:** Augment AI Agent

