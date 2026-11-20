$elfsightScript = '<script src="https://elfsightcdn.com/platform.js" async></script>'
$elfsightDiv = '<div class="elfsight-app-cb0c1266-21c7-44e5-8f4e-859ddbeea578" data-elfsight-app-lazy></div>'

Get-ChildItem *.html | Where-Object { $_.Name -notin @("Header.dc.html", "Footer.dc.html") } | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)

    # 1. Head mein Elfsight script add karein
    if ($c -notmatch 'elfsightcdn\.com/platform\.js') {
        $c = $c -replace '</head>', "$elfsightScript`n</head>"
    }

    # 2. Dummy reviews grid/pagination ko Elfsight widget se replace karein
    if ($c -notmatch 'elfsight-app-cb0c1266-21c7-44e5-8f4e-859ddbeea578') {
        # Jahan sc-for reviews loop hai uski jagah Elfsight widget lagayein
        $c = $c -replace '(?s)<sc-for list="\{\{rev(?:iews|Page|List)[^"]*\}\}"[^>]*>.*?</sc-for>', $elfsightDiv
        # Pagination ("Showing 1 of 2") ko clean karein
        $c = $c -replace '(?s)<div[^>]*>Showing \{\{[^}]+\}\} of \{\{[^}]+\}\}</div>', ''
    }

    [System.IO.File]::WriteAllText($_.FullName, $c, [System.Text.Encoding]::UTF8)
}
Write-Host "DONE! Elfsight Live Google Reviews sab pages par lag gaye hain." -ForegroundColor Green
