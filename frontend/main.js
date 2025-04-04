const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

const startBackend = () => {
  const isDev = !app.isPackaged;
  const backendPath = isDev 
    ? path.join(__dirname, '..', 'backend')
    : path.join(process.resourcesPath, 'backend');

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const startCmd = isDev ? [npmCmd, ['start']] : ['node', ['src/index.js']];

  console.log('Iniciando backend en:', backendPath);
  
  backendProcess = spawn(startCmd[0], startCmd[1], {
    cwd: backendPath,
    shell: true,
    stdio: 'pipe',
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: 4001,
      DB_URI: 'mongodb://127.0.0.1:27017/gestionTareas'
    }
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

  // Esperar a que el backend esté listo antes de cargar la UI
  backendProcess.stdout.on('data', (data) => {
    if (data.toString().includes('Escuchando por el puerto')) {
      mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
    }
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

  // Mostrar pantalla de carga mientras el backend inicia
  mainWindow.loadFile(path.join(__dirname, 'src', 'loading.html'));

  // Iniciar el backend después de que la ventana esté lista
  startBackend();
};

// Cuando la aplicación esté lista
app.whenReady().then(() => {
  createWindow();

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
