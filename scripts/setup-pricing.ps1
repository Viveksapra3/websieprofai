# PowerShell script to set up course pricing
$url = "http://localhost:5000/api/admin/course-pricing"
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    courses = @(
        @{ id = "s-101"; price = 0 },
        @{ id = "s-201"; price = 0 },
        @{ id = "s-310"; price = 0 },
        @{ id = "s-320"; price = 999 },
        @{ id = "course_1"; price = 999 },
        @{ id = "course_2"; price = 1499 },
        @{ id = "course_3"; price = 799 },
        @{ id = "course_4"; price = 1299 },
        @{ id = "course_5"; price = 899 }
    )
} | ConvertTo-Json -Depth 3

Write-Host "Setting up course pricing..."
Write-Host "Request body: $body"

try {
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    Write-Host "✅ Success: $($response.message)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
