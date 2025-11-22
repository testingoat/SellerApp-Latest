$token = "glsa_Mt0mQHSal0BJG710csmzOpnOWougZdVs_e7151fef"
$url = "https://goatgoat.grafana.net/api/datasources"

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "Getting datasources..."

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

