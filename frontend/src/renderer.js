// Configuración de la API
const API_URL = 'http://localhost:4001';
let authToken = localStorage.getItem('token');

// Configuración de Axios
axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Estados de tareas con sus clases
const taskStates = {
  'Pendiente': {
    icon: 'fa-clock',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/20'
  },
  'En progreso': {
    icon: 'fa-spinner',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/20'
  },
  'Completada': {
    icon: 'fa-check-circle',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/20'
  }
};

// Animación para elementos nuevos
const fadeInAnimation = (element) => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 50);
};

// Animación para eliminar elementos
const fadeOutAnimation = (element) => {
  return new Promise(resolve => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(resolve, 300);
  });
};

// Formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Crear elemento de tarea
const createTaskElement = (task) => {
  const stateStyle = taskStates[task.estado || 'Pendiente'];
  const div = document.createElement('div');
  div.className = 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl';
  div.innerHTML = `
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-semibold text-white">${task.titulo}</h3>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${stateStyle.bgColor} ${stateStyle.textColor} ${stateStyle.borderColor} border">
            <i class="fas ${stateStyle.icon} mr-1"></i>
            ${task.estado || 'Pendiente'}
          </span>
        </div>
        <p class="text-gray-400 mb-3">${task.descripcion}</p>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Creada: ${formatDate(task.createdAt)}</p>
          <div class="flex items-center gap-3">
            <select 
              onchange="updateTaskState('${task._id}', this.value)"
              class="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer">
              ${Object.keys(taskStates).map(state => `
                <option value="${state}" ${(task.estado || 'Pendiente') === state ? 'selected' : ''}>
                  ${state}
                </option>
              `).join('')}
            </select>
            <button onclick="deleteTask('${task._id}')" class="text-gray-400 hover:text-red-500 transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  return div;
};

// Crear elemento de nota
const createNoteElement = (note) => {
  const div = document.createElement('div');
  div.className = 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl';
  div.innerHTML = `
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-white mb-1">${note.title}</h3>
        <p class="text-gray-400 mb-2">${note.content}</p>
        <p class="text-sm text-gray-500">Creada: ${formatDate(note.createdAt)}</p>
      </div>
      <button onclick="deleteNote('${note._id}')" class="text-gray-400 hover:text-red-500 transition-colors">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  return div;
};

// UI Helpers
const showError = (message) => {
  console.error('Mostrando error:', message);
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 5000);
};

const showSuccess = (message) => {
  console.log('Mostrando éxito:', message);
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
  setTimeout(() => {
    successDiv.classList.add('hidden');
  }, 5000);
};

const showLoginForm = () => {
  console.log('Mostrando formulario de login');
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('app-section').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  
  // Limpiar formularios
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
};

const showRegisterForm = () => {
  console.log('Mostrando formulario de registro');
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
};

const showApp = () => {
  console.log('Mostrando aplicación principal');
  const userName = localStorage.getItem('userName');
  console.log('Nombre de usuario:', userName);
  
  // Ocultar sección de autenticación
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  
  console.log('Estado inicial - auth-section:', authSection.classList.contains('hidden'));
  console.log('Estado inicial - app-section:', appSection.classList.contains('hidden'));
  
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  
  console.log('Estado final - auth-section:', authSection.classList.contains('hidden'));
  console.log('Estado final - app-section:', appSection.classList.contains('hidden'));
  
  // Actualizar nombre de usuario
  document.getElementById('user-name').textContent = userName;
  
  // Mostrar pestaña de tareas por defecto
  showTab('tasks');
  
  // Cargar datos
  loadTasks();
  loadNotes();
};

// Función para mostrar/ocultar pestañas
const showTab = (tabName) => {
  console.log('Cambiando a pestaña:', tabName);
  
  // Actualizar botones de navegación
  document.querySelectorAll('[data-tab]').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Ocultar todas las secciones
  const tasksSection = document.getElementById('tasks-section');
  const notesSection = document.getElementById('notes-section');
  
  console.log('Estado inicial - tasks-section:', tasksSection.classList.contains('hidden'));
  console.log('Estado inicial - notes-section:', notesSection.classList.contains('hidden'));
  
  tasksSection.classList.add('hidden');
  notesSection.classList.add('hidden');

  // Mostrar la sección seleccionada
  document.getElementById(`${tabName}-section`).classList.remove('hidden');
  
  console.log('Estado final - tasks-section:', tasksSection.classList.contains('hidden'));
  console.log('Estado final - notes-section:', notesSection.classList.contains('hidden'));
};

// Funciones de autenticación
const login = async (email, password) => {
  try {
    console.log('Intentando login con:', email);
    const response = await axios.post('/usuario/login', { email, password });
    console.log('Respuesta del servidor:', response.data);

    if (response.data.success) {
      const { token, user } = response.data.data;
      console.log('Login exitoso:', { user });
      
      // Guardar datos del usuario
      authToken = token;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.nombre);
      
      // Actualizar la UI
      document.getElementById('user-name').textContent = user.nombre;
      
      // Ocultar sección de autenticación y mostrar app
      document.getElementById('auth-section').classList.add('hidden');
      document.getElementById('app-section').classList.remove('hidden');
      
      showSuccess('¡Bienvenido ' + user.nombre + '!');
      
      // Cargar datos iniciales
      showTab('tasks');
      loadTasks();
      loadNotes();
    } else {
      console.error('Error en respuesta:', response.data.message);
      showError(response.data.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error completo:', error);
    showError(error.response?.data?.message || 'Error al conectar con el servidor');
  }
};

const verifyToken = async () => {
  try {
    const response = await axios.get('/usuario/verify');
    if (response.data.success) {
      console.log('Token válido, mostrando app');
      showApp();
    } else {
      console.log('Token inválido, mostrando login');
      showLoginForm();
    }
  } catch (error) {
    console.error('Error al verificar token:', error);
    showLoginForm();
  }
};

const register = async (nombre, email, password) => {
  try {
    console.log('Intentando registro con:', { nombre, email });
    const response = await axios.post('/usuario/register', { nombre, email, password });
    
    if (response.data.success) {
      showSuccess('Registro exitoso. Por favor inicia sesión.');
      showLoginForm();
    } else {
      showError(response.data.message || 'Error al registrarse');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    showError(error.response?.data?.message || 'Error al registrarse');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  authToken = null;
  showLoginForm();
  showSuccess('Sesión cerrada correctamente');
};

// Cargar tareas
const loadTasks = async () => {
  try {
    const response = await axios.get('/tareas');
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (response.data.success) {
      response.data.data.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
        fadeInAnimation(taskElement);
      });
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    showError('Error al cargar las tareas');
  }
};

// Crear tarea
const createTask = async (titulo, descripcion) => {
  try {
    const response = await axios.post('/tareas', { titulo, descripcion });
    const taskElement = createTaskElement(response.data.data);
    document.getElementById('task-list').appendChild(taskElement);
    fadeInAnimation(taskElement);
    showSuccess('Tarea creada exitosamente');
  } catch (error) {
    showError('Error al crear tarea: ' + error.message);
  }
};

// Actualizar estado de tarea
window.updateTaskState = async (id, estado) => {
  try {
    await axios.put(`/tareas/${id}`, { estado });
    await loadTasks();
  } catch (error) {
    console.error('Error al actualizar estado:', error);
  }
};

// Eliminar tarea
window.deleteTask = async (id) => {
  try {
    await axios.delete(`/tareas/${id}`);
    await loadTasks();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
};

// Eliminar nota
window.deleteNote = async (id) => {
  try {
    await axios.delete(`/notas/${id}`);
    await loadNotes();
  } catch (error) {
    console.error('Error al eliminar nota:', error);
  }
};

// Cargar notas
const loadNotes = async () => {
  try {
    const response = await axios.get('/notas');
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';

    if (response.data.success) {
      response.data.data.forEach(note => {
        const noteElement = createNoteElement(note);
        noteList.appendChild(noteElement);
        fadeInAnimation(noteElement);
      });
    }
  } catch (error) {
    console.error('Error al cargar notas:', error);
    showError('Error al cargar las notas');
  }
};

// Crear nota
document.getElementById('note-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;

  try {
    await axios.post('/notas', { title, content });
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    await loadNotes();
  } catch (error) {
    console.error('Error al crear nota:', error);
  }
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, configurando listeners...');

  // Formulario de login
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulario de login enviado');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password);
  });

  // Botones de navegación entre login y registro
  document.getElementById('show-login').addEventListener('click', () => {
    console.log('Click en mostrar login');
    showLoginForm();
  });

  document.getElementById('show-register').addEventListener('click', () => {
    console.log('Click en mostrar registro');
    showRegisterForm();
  });

  // Formulario de registro
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    await register(nombre, email, password);
  });

  // Botón de logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    console.log('Click en logout');
    logout();
  });

  // Botones de navegación de pestañas
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      console.log('Cambiando a pestaña:', tabName);
      showTab(tabName);
    });
  });

  // Verificar si hay token guardado
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token encontrado, verificando...');
    verifyToken();
  } else {
    console.log('No hay token, mostrando login');
    showLoginForm();
  }
});

// Task form
document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('title').value;
  const descripcion = document.getElementById('description').value;
  await createTask(titulo, descripcion);
  e.target.reset();
});