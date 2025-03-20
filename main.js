const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#1a1b1e'
  });

  // Cargar la pantalla de carga primero
  mainWindow.loadFile(path.join(__dirname, 'frontend', 'src', 'loading.html'));
  startBackend();
};

const startBackend = () => {
  const isDev = !app.isPackaged;
  const backendPath = isDev ? 
    path.join(__dirname, 'backend') : 
    path.join(process.resourcesPath, 'backend');
  
  console.log('Iniciando backend en:', backendPath);

  // Asegurarse de que el proceso anterior esté cerrado
  if (backendProcess) {
    try {
      backendProcess.kill();
    } catch (err) {
      console.error('Error al cerrar el proceso anterior:', err);
    }
  }

  backendProcess = spawn('npm', ['start'], {
    cwd: backendPath,
    shell: true,
    env: {
      ...process.env,
      PORT: 4001,
      DB_URI: 'mongodb://127.0.0.1:27017/gestionTareas'
    }
  });

  let serverStarted = false;

  backendProcess.stdout.on('data', (data) => {
    console.log('Backend:', data.toString());
    if (data.toString().includes('Server running on port') && !serverStarted) {
      serverStarted = true;
      setTimeout(() => {
        mainWindow.loadFile(path.join(__dirname, 'frontend', 'src', 'index.html'));
      }, 1000); // Esperar 1 segundo antes de cargar la interfaz principal
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
