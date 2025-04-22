# PowerShell script to update all HTML files with current header and footer templates

# Get header and footer content
$headerContent = Get-Content -Path "header-template.html" -Raw
$footerContent = Get-Content -Path "footer-template.html" -Raw

# Get all HTML files except templates and guide
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | 
    Where-Object { $_.Name -ne "header-template.html" -and 
                  $_.Name -ne "footer-template.html" -and 
                  $_.Name -ne "dynamic-html-guide.html" -and
                  $_.DirectoryName -notmatch "includes" }

foreach ($file in $htmlFiles) {
    Write-Host "Updating $($file.Name)..."
    
    # Read the current file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract the page title and description
    $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
    $descriptionMatch = [regex]::Match($content, '<meta name="description" content="(.*?)"')
    
    $pageTitle = "Page Title"
    $pageDescription = "Page description goes here."
    
    if ($titleMatch.Success) {
        $pageTitle = $titleMatch.Groups[1].Value
    }
    
    if ($descriptionMatch.Success) {
        $pageDescription = $descriptionMatch.Groups[1].Value
    }
    
    # Extract the main content (everything between closing header and opening footer)
    $mainContentMatch = [regex]::Match($content, '</header>(.*?)<footer', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $mainContent = ""
    
    if ($mainContentMatch.Success) {
        $mainContent = $mainContentMatch.Groups[1].Value
    } else {
        Write-Host "  Warning: Could not extract main content for $($file.Name)"
        continue
    }
    
    # Determine which navigation item should be active
    $fileName = $file.Name
    $modifiedHeader = $headerContent
    
    # Set the active class for the current page
    if ($fileName -eq "index.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="index.html"', 'href="index.html" class="active"'
    } elseif ($fileName -eq "why-choose-us.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="why-choose-us.html"', 'href="why-choose-us.html" class="active"'
    } elseif ($fileName -eq "our-services.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="our-services.html"', 'href="our-services.html" class="active"'
    } elseif ($fileName -eq "testimonials.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="testimonials.html"', 'href="testimonials.html" class="active"'
    } elseif ($fileName -eq "contact.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="contact.html"', 'href="contact.html" class="active"'
    } elseif ($fileName -match ".*\.html") {
        # For friend profile pages, highlight the Friends menu
        $modifiedHeader = $modifiedHeader -replace 'href="contact.html"', 'href="contact.html" class="active"'
        
        # Also highlight the specific friend in the dropdown if it exists
        if ($modifiedHeader -match $fileName) {
            $modifiedHeader = $modifiedHeader -replace "href=`"$fileName`"", "href=`"$fileName`" class=`"active`""
        }
    }
    
    # Replace the page title and description
    $modifiedHeader = $modifiedHeader -replace 'PAGE_TITLE', $pageTitle
    $modifiedHeader = $modifiedHeader -replace 'PAGE_DESCRIPTION', $pageDescription
    
    # Create the new file content
    $newContent = $modifiedHeader + $mainContent + $footerContent
    
    # Write the new content back to the file
    Set-Content -Path $file.FullName -Value $newContent
}

Write-Host "`nAll HTML files have been updated successfully!`n"
Write-Host "Remember: Run this script whenever you update header-template.html or footer-template.html"
