# TaskFlow - Gestor de Tareas

Aplicación de escritorio para gestión de tareas desarrollada con Electron, Node.js y MongoDB.

## Características

- ✨ Interfaz moderna con Tailwind CSS
- 📝 Creación y edición de tareas
- 🔄 Actualización de estado (Pendiente/En progreso/Finalizada)
- 🗑️ Eliminación de tareas
- 💾 Almacenamiento persistente con MongoDB

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB instalado y ejecutándose
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/gestionTareas.git
cd gestionTareas
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

4. Crear archivo `.env` en la carpeta backend:
```
DB_URI=mongodb://localhost:27017/taskflow
PORT=4001
```

## Desarrollo

1. Iniciar el backend:
```bash
cd backend
npm start
```

2. Iniciar el frontend en modo desarrollo:
```bash
cd frontend
npm start
```

## Construir Ejecutable

Para generar el ejecutable portable:
```bash
cd frontend
npm run build
```
El ejecutable se generará en `frontend/dist/GestorTareas-win32-x64/GestorTareas.exe`

## Tecnologías

- Frontend: Electron, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- Base de datos: MongoDB
- Empaquetado: electron-packager

## Autor

Daniel Loaiza

## Licencia

ISC