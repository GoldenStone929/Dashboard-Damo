' Clinical Dashboard Launcher
' Double-click this file to open the dashboard
' Works with OneDrive/SharePoint - uses relative paths

Dim shell, fso, scriptPath, dashboardPath, tempPath
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the folder where this script is located (works for any user/location)
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
dashboardPath = scriptPath & "\clinical-dashboard\index.html"

' Get user's temp folder
tempPath = shell.ExpandEnvironmentStrings("%TEMP%")

' Check if dashboard file exists
If Not fso.FileExists(dashboardPath) Then
    MsgBox "Dashboard not found at:" & vbCrLf & dashboardPath & vbCrLf & vbCrLf & "Please ensure the clinical-dashboard folder is synced.", vbExclamation, "Error"
    WScript.Quit
End If

' Browser paths to try
Dim browserPaths(3)
browserPaths(0) = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
browserPaths(1) = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
browserPaths(2) = "C:\Program Files\Google\Chrome\Application\chrome.exe"
browserPaths(3) = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

Dim browserFound, i, browserPath, browserName
browserFound = False

For i = 0 To 3
    If fso.FileExists(browserPaths(i)) Then
        browserPath = browserPaths(i)
        If InStr(browserPath, "Edge") > 0 Then
            browserName = "edge"
        Else
            browserName = "chrome"
        End If
        browserFound = True
        Exit For
    End If
Next

If browserFound Then
    Dim flags
    flags = "--allow-file-access-from-files --disable-web-security --no-first-run --no-default-browser-check --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble"
    If browserName = "edge" Then
        flags = flags & " --disable-features=msEdgeFirstRun,msEdgeSidebarV2"
    End If
    shell.Run """" & browserPath & """ " & flags & " --user-data-dir=""" & tempPath & "\" & browserName & "_dashboard"" """ & dashboardPath & """", 0, False
Else
    MsgBox "Browser not found. Please install Microsoft Edge or Google Chrome.", vbExclamation, "Error"
End If
