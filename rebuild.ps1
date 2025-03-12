# Detener procesos
taskkill /F /IM electron.exe 2>$null
taskkill /F /IM node.exe 2>$null

# Limpiar carpetas antiguas
Remove-Item -Recurse -Force dist/* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/dist/* -ErrorAction SilentlyContinue

# Instalar dependencias
npm install
cd backend
npm install
cd ..

# Empaquetar aplicación
npx electron-packager . GestorTareas --platform=win32 --arch=x64 --out=dist --overwrite --asar --extra-resource=backend --prune=true
