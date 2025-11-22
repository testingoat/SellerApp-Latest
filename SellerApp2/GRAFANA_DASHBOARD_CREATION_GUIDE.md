# 🎯 Grafana Dashboard Creation Guide
## GoatGoat System Monitoring Dashboard

**Created:** 2025-10-08  
**Method:** Grafana HTTP API  
**Target:** Grafana Cloud (https://goatgoat.grafana.net)

---

## 📋 Phase 1: Create Dashboard via HTTP API

### Step 1: Set Environment Variable

**On Windows (PowerShell):**
```powershell
$env:GRAFANA_SERVICE_ACCOUNT_TOKEN = "your-service-account-token-here"
```

**On Linux/Mac (Bash):**
```bash
export GRAFANA_SERVICE_ACCOUNT_TOKEN="your-service-account-token-here"
```

---

### Step 2: Create Dashboard

**Run this curl command:**

**Windows (PowerShell):**
```powershell
curl -X POST "https://goatgoat.grafana.net/api/dashboards/db" `
  -H "Authorization: Bearer $env:GRAFANA_SERVICE_ACCOUNT_TOKEN" `
  -H "Content-Type: application/json" `
  -d "@grafana-dashboard.json"
```

**Linux/Mac (Bash):**
```bash
curl -X POST "https://goatgoat.grafana.net/api/dashboards/db" \
  -H "Authorization: Bearer ${GRAFANA_SERVICE_ACCOUNT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @grafana-dashboard.json
```

---

### Step 3: Expected Response

**Success Response (HTTP 200):**
```json
{
  "id": 123,
  "uid": "abc123xyz",
  "url": "/d/abc123xyz/goatgoat-system-monitoring",
  "status": "success",
  "version": 1,
  "slug": "goatgoat-system-monitoring"
}
```

**Key Fields:**
- `uid`: Dashboard unique identifier (e.g., `abc123xyz`)
- `url`: Dashboard path (e.g., `/d/abc123xyz/goatgoat-system-monitoring`)
- `id`: Dashboard numeric ID

---

### Step 4: Retrieve Dashboard URL

**Full Dashboard URL:**
```
https://goatgoat.grafana.net/d/{uid}/goatgoat-system-monitoring
```

**Example:**
```
https://goatgoat.grafana.net/d/abc123xyz/goatgoat-system-monitoring
```

**Replace `{uid}` with the actual UID from the response.**

---

### Step 5: Verify Dashboard

1. Open the dashboard URL in your browser
2. Verify all 6 panels are visible:
   - ✅ CPU Usage (time series)
   - ✅ Memory Usage (gauge)
   - ✅ Disk Usage (bar gauge)
   - ✅ Network Traffic (time series)
   - ✅ System Uptime (stat)
   - ✅ Load Average (time series)
3. Confirm metrics are displaying (may take 1-2 minutes for data to appear)

---

## 🔧 Troubleshooting

### Error: "401 Unauthorized"
**Cause:** Invalid or missing service account token

**Solution:**
1. Verify your service account token is correct
2. Check that the token has `dashboards:create` and `dashboards:write` permissions
3. Ensure the token hasn't expired

---

### Error: "403 Forbidden"
**Cause:** Insufficient permissions

**Solution:**
1. Go to Grafana Cloud → Configuration → Service Accounts
2. Find your service account
3. Add these permissions:
   - `dashboards:create` with scope `dashboards:*`
   - `dashboards:write` with scope `dashboards:*`
   - `folders:create` with scope `folders:*` (if needed)

---

### Error: "400 Bad Request"
**Cause:** Invalid JSON or missing required fields

**Solution:**
1. Verify `grafana-dashboard.json` file exists in current directory
2. Check JSON syntax is valid:
   ```bash
   cat grafana-dashboard.json | jq .
   ```
3. Ensure file is not corrupted

---

### Dashboard Created But No Data Showing
**Cause:** Prometheus datasource not configured or no metrics available

**Solution:**
1. Check that Grafana Alloy is running and sending metrics:
   ```bash
   ssh root@147.93.108.121 "systemctl status grafana-alloy"
   ```
2. Verify Node Exporter is running:
   ```bash
   ssh root@147.93.108.121 "systemctl status prometheus-node-exporter"
   ```
3. Wait 1-2 minutes for metrics to populate
4. Check Grafana Cloud → Explore → Prometheus to verify metrics are arriving

---

## 📊 Dashboard Details

### Panel 1: CPU Usage
- **Type:** Time series
- **Query:** `100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`
- **Unit:** Percent (0-100)
- **Thresholds:** Green (0-70%), Yellow (70-90%), Red (90-100%)

### Panel 2: Memory Usage
- **Type:** Gauge
- **Query:** `100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))`
- **Unit:** Percent (0-100)
- **Thresholds:** Green (0-70%), Yellow (70-90%), Red (90-100%)

### Panel 3: Disk Usage
- **Type:** Bar gauge
- **Query:** `100 - ((node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} * 100) / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})`
- **Unit:** Percent (0-100)
- **Thresholds:** Green (0-70%), Yellow (70-90%), Red (90-100%)

### Panel 4: Network Traffic
- **Type:** Time series
- **Queries:**
  - Received: `rate(node_network_receive_bytes_total{device!="lo"}[5m])`
  - Transmitted: `rate(node_network_transmit_bytes_total{device!="lo"}[5m])`
- **Unit:** Bytes per second

### Panel 5: System Uptime
- **Type:** Stat
- **Query:** `node_time_seconds - node_boot_time_seconds`
- **Unit:** Seconds (displayed as duration)

### Panel 6: Load Average
- **Type:** Time series
- **Queries:**
  - 1 min: `node_load1`
  - 5 min: `node_load5`
  - 15 min: `node_load15`

---

## 🎯 Next Steps

**After successful dashboard creation:**

1. **Copy the dashboard UID** from the response
2. **Copy the full dashboard URL** (https://goatgoat.grafana.net/d/{uid}/goatgoat-system-monitoring)
3. **Provide both to the AI assistant** for Task 2.2 (HTML page creation)

**Example message to AI:**
```
Dashboard created successfully!
UID: abc123xyz
URL: https://goatgoat.grafana.net/d/abc123xyz/goatgoat-system-monitoring

Please proceed with Task 2.2 (Create HTML Dashboard Page).
```

---

## 📝 Alternative: Manual Dashboard Creation

If the HTTP API method doesn't work, you can create the dashboard manually:

1. Login to https://goatgoat.grafana.net
2. Click "+" → "Import"
3. Click "Upload JSON file"
4. Select `grafana-dashboard.json`
5. Click "Load"
6. Click "Import"
7. Copy the dashboard URL from your browser

---

## 🔒 Security Notes

- ✅ Service account token is used (not API key)
- ✅ Token is passed via environment variable (not hardcoded)
- ✅ Dashboard is created with `overwrite: false` (won't overwrite existing dashboards)
- ✅ All queries use read-only Prometheus metrics

---

## 📚 References

- [Grafana HTTP API - Dashboards](https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/)
- [Grafana Dashboard JSON Model](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model/)
- [Prometheus Node Exporter Metrics](https://github.com/prometheus/node_exporter)

---

## ✅ Verification Checklist

Before proceeding to Task 2.2:

- [ ] Dashboard created successfully (HTTP 200 response)
- [ ] Dashboard UID obtained from response
- [ ] Dashboard URL accessible in browser
- [ ] All 6 panels visible in dashboard
- [ ] Metrics displaying correctly (or will display within 1-2 minutes)
- [ ] Dashboard URL and UID provided to AI assistant

---

**Ready to proceed? Run the curl command and provide the dashboard UID and URL!** 🚀

