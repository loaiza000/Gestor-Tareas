const { spawn } = require('child_process');
const path = require('path');

// Iniciar el servidor backend
const startBackend = () => {
    const backendPath = path.join(__dirname, 'backend');
    const backend = spawn('npm', ['start'], {
        cwd: backendPath,
        shell: true,
        stdio: 'pipe'
    });

    backend.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backend.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });

    return backend;
};

// Iniciar la aplicación frontend
const startFrontend = () => {
    const frontendPath = path.join(__dirname, 'frontend');
    const frontend = spawn('npm', ['start'], {
        cwd: frontendPath,
        shell: true,
        stdio: 'pipe'
    });

    frontend.stdout.on('data', (data) => {
        console.log(`Frontend: ${data}`);
    });

    frontend.stderr.on('data', (data) => {
        console.error(`Frontend Error: ${data}`);
    });

    return frontend;
};

// Iniciar ambos servicios
const backend = startBackend();
const frontend = startFrontend();

// Manejar el cierre de la aplicación
process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit();
});
