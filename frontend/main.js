const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

const startBackend = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const backendPath = isDev 
    ? path.join(__dirname, '..', 'backend')
    : path.join(process.resourcesPath, 'backend');

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  console.log('Iniciando backend en:', backendPath);
  
  backendProcess = spawn(npmCmd, ['start'], {
    cwd: backendPath,
    shell: true,
    stdio: 'pipe',
    windowsHide: true
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Error al iniciar el backend:', err);
  });
};

const createWindow = () => {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: 'Gestor de Tareas',
    autoHideMenuBar: true,
    frame: true,
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Cargar el archivo HTML
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Iniciar el backend después de que la ventana esté lista
  mainWindow.webContents.on('did-finish-load', () => {
    startBackend();
  });
};

// Cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow();

  // En macOS, es común volver a crear una ventana cuando
  // se hace clic en el icono del dock y no hay otras ventanas abiertas
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
