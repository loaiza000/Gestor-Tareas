const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

const startBackend = () => {
  const isDev = !app.isPackaged;
  const backendPath = isDev ? 
    path.join(__dirname, 'backend') : 
    path.join(process.resourcesPath, 'backend');
  
  console.log('Iniciando backend en:', backendPath);

  backendProcess = spawn('npm', ['start'], {
    cwd: backendPath,
    shell: true,
    env: {
      ...process.env,
      PORT: 4001,
      DB_URI: 'mongodb://127.0.0.1:27017/gestionTareas'
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log('Backend:', data.toString());
    if (data.toString().includes('Server running on port')) {
      mainWindow.loadFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error('Backend Error:', data.toString());
  });

  backendProcess.on('close', (code) => {
    console.log('Backend process exited with code:', code);
    if (code !== 0 && !isDev) {
      app.quit();
    }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
    if (!isDev) {
      app.quit();
    }
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: 'TaskFlow Pro',
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
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

process.on('exit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
