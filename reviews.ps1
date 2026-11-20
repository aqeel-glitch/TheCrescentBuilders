$elfsightDiv = '<div class="elfsight-app-cb0c1266-21c7-44e5-8f4e-859ddbeea578" data-elfsight-app-lazy></div>'

Get-ChildItem *.html | Where-Object { $_.Name -notin @("Header.dc.html", "Footer.dc.html") } | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)

    if ($c -match '\{\{r\.(name|text)\}\}') {
        # 1. Kisi bhi review grid (2-column ya 3-column) ko Elfsight widget se replace karein
        $c = $c -replace '(?s)<div style="display:\s*grid;[^"]*">\s*<sc-for[^>]*>.*?\{\{r\.(name|text)\}\}.*?</sc-for>\s*</div>', $elfsightDiv

        # 2. "Showing 1 of 2" wala footer clean karein
        $c = $c -replace '(?s)<div[^>]*>\s*<span[^>]*>Showing \{\{page\}\} of \{\{pages\}\}</span>\s*</div>', ''

        [System.IO.File]::WriteAllText($_.FullName, $c, [System.Text.Encoding]::UTF8)
    }
}
Write-Host "DONE! Sab pages par dummy review cards replace ho gaye." -ForegroundColor Green
