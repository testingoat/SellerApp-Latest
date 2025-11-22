#!/bin/bash

cd /var/www/goatgoat-production/server

# Backup
cp dist/app.js dist/app.js.backup-logs-$(date +%Y%m%d-%H%M%S)

# Find the line with FCM API endpoints and add logs stream routes after it
LINE_NUM=$(grep -n "console.log('✅ FCM API endpoints registered successfully');" dist/app.js | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
  echo "Error: Could not find FCM API endpoints line"
  exit 1
fi

# Insert the new lines after the FCM line
sed -i "${LINE_NUM}a\\    // Register logs stream routes\\n    const logsStreamRouter = require('./routes/logs-stream');\\n    app.register(logsStreamRouter);\\n    console.log('✅ Logs stream routes registered successfully');" dist/app.js

echo "✅ Logs stream routes added successfully"
echo "Restarting production server..."

pm2 restart goatgoat-production

echo "Done! Access logs at: http://147.93.108.121:3000/logs-viewer"

