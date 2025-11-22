$token = "glsa_Mt0mQHSal0BJG710csmzOpnOWougZdVs_e7151fef"
$url = "https://goatgoat.grafana.net/api/dashboards/db"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$dashboard = @{
    dashboard = @{
        uid = "f3ee8022-12b2-4ddf-a8d5-e53fdd8ae81c"
        title = "GoatGoat System Monitoring & Logs"
        tags = @("goatgoat", "system", "monitoring", "logs")
        timezone = "browser"
        schemaVersion = 16
        refresh = "30s"
        time = @{
            from = "now-24h"
            to = "now"
        }
        panels = @(
            @{
                id = 1
                gridPos = @{
                    h = 15
                    w = 24
                    x = 0
                    y = 0
                }
                type = "logs"
                title = "All Application Logs (Production + Staging)"
                targets = @(
                    @{
                        expr = '{job="pm2-logs"}'
                        refId = "A"
                        datasource = @{
                            type = "loki"
                            uid = "grafanacloud-logs"
                        }
                    }
                )
                options = @{
                    showTime = $true
                    showLabels = $true
                    showCommonLabels = $false
                    wrapLogMessage = $true
                    prettifyLogMessage = $false
                    enableLogDetails = $true
                    dedupStrategy = "none"
                    sortOrder = "Descending"
                }
            },
            @{
                id = 2
                gridPos = @{
                    h = 12
                    w = 12
                    x = 0
                    y = 15
                }
                type = "logs"
                title = "Production Logs (stdout + stderr)"
                targets = @(
                    @{
                        expr = '{app="goatgoat-production"}'
                        refId = "A"
                        datasource = @{
                            type = "loki"
                            uid = "grafanacloud-logs"
                        }
                    }
                )
                options = @{
                    showTime = $true
                    showLabels = $true
                    wrapLogMessage = $true
                    enableLogDetails = $true
                    sortOrder = "Descending"
                }
            },
            @{
                id = 3
                gridPos = @{
                    h = 12
                    w = 12
                    x = 12
                    y = 15
                }
                type = "logs"
                title = "Staging Logs (stdout + stderr)"
                targets = @(
                    @{
                        expr = '{app="goatgoat-staging"}'
                        refId = "A"
                        datasource = @{
                            type = "loki"
                            uid = "grafanacloud-logs"
                        }
                    }
                )
                options = @{
                    showTime = $true
                    showLabels = $true
                    wrapLogMessage = $true
                    enableLogDetails = $true
                    sortOrder = "Descending"
                }
            },
            @{
                id = 4
                gridPos = @{
                    h = 12
                    w = 12
                    x = 0
                    y = 27
                }
                type = "logs"
                title = "Error Logs Only (Production + Staging)"
                targets = @(
                    @{
                        expr = '{job="pm2-logs", log_type="stderr"}'
                        refId = "A"
                        datasource = @{
                            type = "loki"
                            uid = "grafanacloud-logs"
                        }
                    }
                )
                options = @{
                    showTime = $true
                    showLabels = $true
                    wrapLogMessage = $true
                    enableLogDetails = $true
                    sortOrder = "Descending"
                }
            },
            @{
                id = 5
                gridPos = @{
                    h = 12
                    w = 12
                    x = 12
                    y = 27
                }
                type = "logs"
                title = "Application Logs Only (Production + Staging)"
                targets = @(
                    @{
                        expr = '{job="pm2-logs", log_type="stdout"}'
                        refId = "A"
                        datasource = @{
                            type = "loki"
                            uid = "grafanacloud-logs"
                        }
                    }
                )
                options = @{
                    showTime = $true
                    showLabels = $true
                    wrapLogMessage = $true
                    enableLogDetails = $true
                    sortOrder = "Descending"
                }
            }
        )
    }
    overwrite = $true
    message = "Updated with better log panels and 24h time range"
}

$body = $dashboard | ConvertTo-Json -Depth 20

Write-Host "Updating Grafana dashboard with better configuration..."

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Dashboard UID: $($response.uid)"
    Write-Host "Dashboard URL: https://goatgoat.grafana.net/d/$($response.uid)/goatgoat-system-monitoring"
    Write-Host ""
    Write-Host "Changes made:" -ForegroundColor Cyan
    Write-Host "- Default time range: Last 24 hours (instead of 6 hours)"
    Write-Host "- Panel 1: All logs from both environments"
    Write-Host "- Panel 2: Production logs only (stdout + stderr)"
    Write-Host "- Panel 3: Staging logs only (stdout + stderr)"
    Write-Host "- Panel 4: Error logs only (stderr from both)"
    Write-Host "- Panel 5: Application logs only (stdout from both)"
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    } catch {}
}

