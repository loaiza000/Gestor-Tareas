const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

const startBackend = () => {
  const isDev = !app.isPackaged;
  const backendPath = isDev 
    ? path.join(__dirname, 'backend')
    : path.join(process.resourcesPath, 'backend');

  console.log('Iniciando backend en:', backendPath);
  
  const startCmd = isDev ? ['npm', ['start']] : ['node', ['src/index.js']];
  
  backendProcess = spawn(startCmd[0], startCmd[1], {
    cwd: backendPath,
    shell: true,
    stdio: 'pipe',
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: 4001
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
    if (data.toString().includes('Escuchando por el puerto')) {
      mainWindow.loadFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Error al iniciar el backend:', err);
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: 'Gestor de Tareas',
    autoHideMenuBar: true,
    frame: true,
    icon: path.join(__dirname, 'frontend', 'build', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Mostrar pantalla de carga mientras el backend inicia
  mainWindow.loadFile(path.join(__dirname, 'frontend', 'src', 'loading.html'));

  // Iniciar el backend
  startBackend();

  // Abrir DevTools en desarrollo
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
