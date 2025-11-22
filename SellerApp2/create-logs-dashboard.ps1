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
        panels = @(
            @{
                id = 1
                gridPos = @{
                    h = 12
                    w = 24
                    x = 0
                    y = 0
                }
                type = "logs"
                title = "Application Logs - All Environments"
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
                    h = 10
                    w = 12
                    x = 0
                    y = 12
                }
                type = "logs"
                title = "Production Error Logs"
                targets = @(
                    @{
                        expr = '{app="goatgoat-production", log_type="stderr"}'
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
                    h = 10
                    w = 12
                    x = 12
                    y = 12
                }
                type = "logs"
                title = "Staging Error Logs"
                targets = @(
                    @{
                        expr = '{app="goatgoat-staging", log_type="stderr"}'
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
                    h = 10
                    w = 12
                    x = 0
                    y = 22
                }
                type = "logs"
                title = "Production Application Logs"
                targets = @(
                    @{
                        expr = '{app="goatgoat-production", log_type="stdout"}'
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
                    h = 10
                    w = 12
                    x = 12
                    y = 22
                }
                type = "logs"
                title = "Staging Application Logs"
                targets = @(
                    @{
                        expr = '{app="goatgoat-staging", log_type="stdout"}'
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
    message = "Updated with log panels for PM2 logs"
}

$body = $dashboard | ConvertTo-Json -Depth 20

Write-Host "Updating Grafana dashboard with log panels..."

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Dashboard UID: $($response.uid)"
    Write-Host "Dashboard URL: https://goatgoat.grafana.net/d/$($response.uid)/goatgoat-system-monitoring"
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    # Try to read the response body
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
    } catch {}
}

