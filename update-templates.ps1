$htmlFiles = Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.Name -ne "header-template.html" -and $_.Name -ne "footer-template.html" -and $_.Name -ne "dynamic-html-guide.html" }

foreach ($file in $htmlFiles) {
    Write-Host "Updating $($file.FullName)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remove Gallery link from navigation
    $content = $content -replace '<li><a href="gallery\.html".*?>Gallery</a></li>', ''
    
    # Remove social media links
    $content = $content -replace '<div class="social-links">.*?</div>', '' -replace '(?s)(?<=<div class="footer-info">.*?</div>)\s+\n\s+', "`n            "
    
    # Remove Gallery link from footer
    $content = $content -replace '<a href="gallery\.html">Gallery</a>', ''
    
    # Write updated content back to file
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "All HTML files have been updated!"
