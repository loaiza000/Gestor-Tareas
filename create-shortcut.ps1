$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$Home\Desktop\Gestor de Tareas.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\dist\GestorTareas-win32-x64\GestorTareas.exe"
$Shortcut.IconLocation = "$PSScriptRoot\dist\GestorTareas-win32-x64\GestorTareas.exe,0"
$Shortcut.Description = "Gestor de Tareas - Daniel Loaiza"
$Shortcut.WorkingDirectory = "$PSScriptRoot\dist\GestorTareas-win32-x64"
$Shortcut.Save()
