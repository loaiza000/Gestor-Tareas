const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Rutas
const backendDir = path.join(__dirname, '..', 'backend');
const distDir = path.join(__dirname, 'dist');
const resourcesDir = path.join(distDir, 'GestorTareas-win32-x64', 'resources');

// Asegurarse de que el directorio resources existe
fs.ensureDirSync(resourcesDir);

// Copiar el backend al directorio resources
fs.copySync(backendDir, path.join(resourcesDir, 'app.asar.unpacked', 'backend'), {
    filter: (src) => {
        // Excluir node_modules y archivos innecesarios
        return !src.includes('node_modules') && 
               !src.includes('.git') && 
               !src.endsWith('.log');
    }
});

// Instalar dependencias del backend en el directorio copiado
exec('npm install --production', {
    cwd: path.join(resourcesDir, 'app.asar.unpacked', 'backend')
}, (error, stdout, stderr) => {
    if (error) {
        console.error('Error instalando dependencias del backend:', error);
        return;
    }
    console.log('Dependencias del backend instaladas correctamente');
});
