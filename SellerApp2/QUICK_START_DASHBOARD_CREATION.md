# ⚡ Quick Start: Create Grafana Dashboard

## 🎯 3-Step Dashboard Creation

### Step 1: Set Token (Choose your OS)

**Windows PowerShell:**
```powershell
$env:GRAFANA_SERVICE_ACCOUNT_TOKEN = "your-token-here"
```

**Linux/Mac:**
```bash
export GRAFANA_SERVICE_ACCOUNT_TOKEN="your-token-here"
```

---

### Step 2: Run Curl Command (Choose your OS)

**Windows PowerShell:**
```powershell
curl -X POST "https://goatgoat.grafana.net/api/dashboards/db" `
  -H "Authorization: Bearer $env:GRAFANA_SERVICE_ACCOUNT_TOKEN" `
  -H "Content-Type: application/json" `
  -d "@grafana-dashboard.json"
```

**Linux/Mac:**
```bash
curl -X POST "https://goatgoat.grafana.net/api/dashboards/db" \
  -H "Authorization: Bearer ${GRAFANA_SERVICE_ACCOUNT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @grafana-dashboard.json
```

---

### Step 3: Get Dashboard URL

**From the response, copy:**
- `uid` field (e.g., `abc123xyz`)

**Build the URL:**
```
https://goatgoat.grafana.net/d/{uid}/goatgoat-system-monitoring
```

**Example:**
```
https://goatgoat.grafana.net/d/abc123xyz/goatgoat-system-monitoring
```

---

## ✅ What to Send Back to AI

**After successful creation, send:**
```
Dashboard created successfully!
UID: abc123xyz
URL: https://goatgoat.grafana.net/d/abc123xyz/goatgoat-system-monitoring

Please proceed with Task 2.2.
```

---

## 🔧 Quick Troubleshooting

**401 Error?** → Check your service account token
**403 Error?** → Add `dashboards:create` permission to service account
**400 Error?** → Verify `grafana-dashboard.json` file exists in current directory
**No data in dashboard?** → Wait 1-2 minutes for metrics to populate

---

## 📁 Files Created

- ✅ `grafana-dashboard.json` - Dashboard configuration
- ✅ `GRAFANA_DASHBOARD_CREATION_GUIDE.md` - Detailed guide
- ✅ `QUICK_START_DASHBOARD_CREATION.md` - This file

---

**Total Time: ~30 seconds** ⚡

