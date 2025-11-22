#!/bin/bash

# Update Grafana dashboard with log panels
# This script will overwrite the existing dashboard with log panels

GRAFANA_URL="https://goatgoat.grafana.net"
DASHBOARD_UID="f3ee8022-12b2-4ddf-a8d5-e53fdd8ae81c"

echo "Updating Grafana dashboard with log panels..."

curl -X POST "${GRAFANA_URL}/api/dashboards/db" \
  -H "Authorization: Bearer ${GRAFANA_SERVICE_ACCOUNT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @grafana-dashboard-with-logs.json

echo ""
echo "Dashboard updated!"
echo "View at: ${GRAFANA_URL}/d/${DASHBOARD_UID}/goatgoat-system-monitoring"

