$token = "glsa_Mt0mQHSal0BJG710csmzOpnOWougZdVs_e7151fef"
$dashboardUid = "f3ee8022-12b2-4ddf-a8d5-e53fdd8ae81c"
$url = "https://goatgoat.grafana.net/api/dashboards/uid/$dashboardUid"

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "Getting existing dashboard..."

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $response | ConvertTo-Json -Depth 20 | Out-File "existing-dashboard.json"
    Write-Host "Dashboard saved to existing-dashboard.json" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

