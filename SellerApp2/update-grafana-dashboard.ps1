$token = "glsa_Mt0mQHSal0BJG710csmzOpnOWougZdVs_e7151fef"
$url = "https://goatgoat.grafana.net/api/dashboards/db"
$jsonFile = "grafana-dashboard-with-logs.json"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = Get-Content $jsonFile -Raw

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
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body: $responseBody" -ForegroundColor Yellow
}

