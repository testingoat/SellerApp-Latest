#!/usr/bin/env python3

# Read the app.ts file
with open('/var/www/goatgoat-staging/server/src/app.ts', 'r') as f:
    lines = f.readlines()

# Read the route addition
with open('/tmp/grafana-route-addition.txt', 'r') as f:
    route_lines = f.readlines()

# Find the line after FCM dashboard route
insert_position = None
for i, line in enumerate(lines):
    if 'app.get("/admin/fcm-management"' in line:
        # Find the closing brace of this route
        brace_count = 0
        for j in range(i, len(lines)):
            brace_count += lines[j].count('{')
            brace_count -= lines[j].count('}')
            if brace_count == 0 and '});' in lines[j]:
                insert_position = j + 1
                break
        break

if insert_position:
    # Insert the route
    lines = lines[:insert_position] + route_lines + lines[insert_position:]
    
    # Write back
    with open('/var/www/goatgoat-staging/server/src/app.ts', 'w') as f:
        f.writelines(lines)
    
    print(f'✅ Route inserted at line {insert_position}')
    print(f'✅ Total lines in file: {len(lines)}')
else:
    print('❌ Could not find insertion point')

