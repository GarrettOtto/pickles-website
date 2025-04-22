# PowerShell script to implement the header template on all HTML pages

# Get header template content
$headerTemplate = Get-Content -Path "header-template.html" -Raw

# Get all HTML files except templates and guide
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -Recurse | 
    Where-Object { $_.Name -ne "header-template.html" -and 
                  $_.Name -ne "footer-template.html" -and 
                  $_.Name -ne "dynamic-html-guide.html" -and
                  $_.DirectoryName -notmatch "includes" }

foreach ($file in $htmlFiles) {
    Write-Host "Updating header for $($file.Name)..."
    
    # Read the current file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Extract the page title and description
    $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
    $descriptionMatch = [regex]::Match($content, '<meta name="description" content="(.*?)"')
    
    $pageTitle = "Page Title"
    $pageDescription = "Page description goes here."
    
    if ($titleMatch.Success) {
        $pageTitle = $titleMatch.Groups[1].Value
        # Remove any duplicate "— Pickles Friend Group" in the title
        $pageTitle = $pageTitle -replace " — Pickles Friend Group — Pickles Friend Group", " — Pickles Friend Group"
        $pageTitle = $pageTitle -replace " — Pickles Friend Group", ""
    }
    
    if ($descriptionMatch.Success) {
        $pageDescription = $descriptionMatch.Groups[1].Value
    }
    
    # Extract the main content (everything after closing header tag)
    $mainContentMatch = [regex]::Match($content, '</header>(.*?)$', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $mainContent = ""
    
    if ($mainContentMatch.Success) {
        $mainContent = $mainContentMatch.Groups[1].Value
    } else {
        Write-Host "  Warning: Could not extract main content for $($file.Name)"
        continue
    }
    
    # Determine which navigation item should be active
    $fileName = $file.Name
    $modifiedHeader = $headerTemplate
    
    # Replace placeholders with actual content
    $modifiedHeader = $modifiedHeader -replace 'PAGE_TITLE', "$pageTitle — Pickles Friend Group"
    $modifiedHeader = $modifiedHeader -replace 'PAGE_DESCRIPTION', $pageDescription
    
    # Set the active class for the current page
    if ($fileName -eq "index.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="index.html" id="nav-home"', 'href="index.html" id="nav-home" class="active"'
    } elseif ($fileName -eq "why-choose-us.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="why-choose-us.html" id="nav-about"', 'href="why-choose-us.html" id="nav-about" class="active"'
    } elseif ($fileName -eq "our-services.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="our-services.html" id="nav-activities"', 'href="our-services.html" id="nav-activities" class="active"'
    } elseif ($fileName -eq "testimonials.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="testimonials.html" id="nav-stories"', 'href="testimonials.html" id="nav-stories" class="active"'
    } elseif ($fileName -eq "contact.html") {
        $modifiedHeader = $modifiedHeader -replace 'href="contact.html" id="nav-friends"', 'href="contact.html" id="nav-friends" class="active"'
    } elseif ($fileName -match ".*\.html") {
        # For friend profile pages, highlight the Friends menu
        $modifiedHeader = $modifiedHeader -replace 'href="contact.html" id="nav-friends"', 'href="contact.html" id="nav-friends" class="active"'
        
        # Also highlight the specific friend in the dropdown if it exists
        if ($modifiedHeader -match $fileName) {
            $modifiedHeader = $modifiedHeader -replace "href=`"$fileName`">", "href=`"$fileName`" class=`"active`">"
        }
    }
    
    # Create the new file content
    $newContent = $modifiedHeader + $mainContent
    
    # Write the new content back to the file
    Set-Content -Path $file.FullName -Value $newContent
}

Write-Host "`nHeader has been implemented on all HTML files successfully!`n"
Write-Host "Remember: Run this script whenever you update header-template.html"
