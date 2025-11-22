#!/bin/bash

cd /var/www/goatgoat-staging/server

# Backup
cp dist/app.js dist/app.js.backup-logs-$(date +%Y%m%d-%H%M%S)

# Find the line with FCM API endpoints and add logs stream routes after it
LINE_NUM=$(grep -n "console.log('✅ FCM API endpoints registered successfully');" dist/app.js | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
  echo "Error: Could not find FCM API endpoints line"
  exit 1
fi

# Create a temporary file with the new content
cat > /tmp/logs-import-staging.txt << 'EOF'
    // Register logs stream routes
    const logsStreamModule = await import('./routes/logs-stream.js');
    await app.register(logsStreamModule.default);
    console.log('✅ Logs stream routes registered successfully');
EOF

# Insert the new lines after the FCM line
head -n $LINE_NUM dist/app.js > /tmp/app-new-staging.js
cat /tmp/logs-import-staging.txt >> /tmp/app-new-staging.js
tail -n +$((LINE_NUM + 1)) dist/app.js >> /tmp/app-new-staging.js

# Replace the original file
mv /tmp/app-new-staging.js dist/app.js

echo "✅ Logs stream routes added to staging successfully"
echo "Restarting staging server..."

pm2 restart goatgoat-staging

sleep 3
echo ""
echo "Checking for errors..."
pm2 logs goatgoat-staging --lines 5 --nostream

echo ""
echo "Done! Access logs at:"
echo "  - http://147.93.108.121:4000/logs-viewer"
echo "  - https://staging.goatgoat.tech/logs-viewer"

