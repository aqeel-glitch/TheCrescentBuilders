$elfsightDiv = '<div class="elfsight-app-cb0c1266-21c7-44e5-8f4e-859ddbeea578" data-elfsight-app-lazy></div>'

Get-ChildItem *.html | Where-Object { $_.Name -notin @("Header.dc.html", "Footer.dc.html") } | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)

    if ($c -match '\{\{r\.name\}\}') {
        # 1. Purana 3-column dummy review grid ko Elfsight widget se replace karein
        $c = $c -replace '(?s)<div style="display:\s*grid;\s*grid-template-columns:\s*repeat\([23],\s*minmax\(0,\s*1fr\)\);\s*gap:\s*20px">\s*<sc-for[^>]*>.*?</sc-for>\s*</div>', $elfsightDiv

        # 2. Purane < > slider buttons aur "Showing 1 of 2" ko clean karein
        $c = $c -replace '(?s)<button[^>]*aria-label="Previous[^"]*"[^>]*>.*?</button>', ''
        $c = $c -replace '(?s)<button[^>]*aria-label="Next[^"]*"[^>]*>.*?</button>', ''
        $c = $c -replace '(?s)<div[^>]*>\s*<span[^>]*>Showing \{\{page\}\} of \{\{pages\}\}</span>\s*</div>', ''

        [System.IO.File]::WriteAllText($_.FullName, $c, [System.Text.Encoding]::UTF8)
    }
}
Write-Host "DONE! Dummy reviews hat kar live Elfsight widget lag gaya hai." -ForegroundColor Green
