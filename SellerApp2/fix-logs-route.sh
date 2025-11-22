#!/bin/bash

cd /var/www/goatgoat-production/server

# Restore from backup if the previous attempt failed
LATEST_BACKUP=$(ls -t dist/app.js.backup-logs-* 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
  echo "Restoring from backup: $LATEST_BACKUP"
  cp "$LATEST_BACKUP" dist/app.js
fi

# Find the line with FCM API endpoints
LINE_NUM=$(grep -n "console.log('✅ FCM API endpoints registered successfully');" dist/app.js | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
  echo "Error: Could not find FCM API endpoints line"
  exit 1
fi

# Create a temporary file with the new content
cat > /tmp/logs-import.txt << 'EOF'
    // Register logs stream routes
    const logsStreamModule = await import('./routes/logs-stream.js');
    await app.register(logsStreamModule.default);
    console.log('✅ Logs stream routes registered successfully');
EOF

# Insert the new lines after the FCM line
head -n $LINE_NUM dist/app.js > /tmp/app-new.js
cat /tmp/logs-import.txt >> /tmp/app-new.js
tail -n +$((LINE_NUM + 1)) dist/app.js >> /tmp/app-new.js

# Replace the original file
mv /tmp/app-new.js dist/app.js

echo "✅ Logs stream routes added successfully"
echo "Restarting production server..."

pm2 restart goatgoat-production

sleep 3
echo ""
echo "Checking for errors..."
pm2 logs goatgoat-production --lines 5 --nostream

echo ""
echo "Done! Access logs at: http://147.93.108.121:3000/logs-viewer"

