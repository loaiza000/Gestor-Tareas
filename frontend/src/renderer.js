// Configuración de la API
const API_URL = 'http://localhost:4001';

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

// Cargar tareas
const loadTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tarea`);
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    if (response.data.data) {
      response.data.data.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
        fadeInAnimation(taskElement);
      });
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
  }
};

// Cargar notas
const loadNotes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notes`);
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = '';
    if (response.data.data) {
      response.data.data.forEach(note => {
        const noteElement = createNoteElement(note);
        noteList.appendChild(noteElement);
        fadeInAnimation(noteElement);
      });
    }
  } catch (error) {
    console.error('Error al cargar notas:', error);
  }
};

// Crear tarea
document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('title').value;
  const descripcion = document.getElementById('description').value;

  try {
    await axios.post(`${API_URL}/tarea`, {
      titulo,
      descripcion,
      estado: 'Pendiente'
    });
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    await loadTasks();
  } catch (error) {
    console.error('Error al crear tarea:', error);
  }
});

// Crear nota
document.getElementById('note-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;

  try {
    await axios.post(`${API_URL}/notes`, { title, content });
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    await loadNotes();
  } catch (error) {
    console.error('Error al crear nota:', error);
  }
});

// Actualizar estado de tarea
window.updateTaskState = async (id, estado) => {
  try {
    await axios.put(`${API_URL}/tarea/${id}`, { estado });
    await loadTasks();
  } catch (error) {
    console.error('Error al actualizar estado:', error);
  }
};

// Eliminar tarea
window.deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/tarea/${id}`);
    await loadTasks();
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
};

// Eliminar nota
window.deleteNote = async (id) => {
  try {
    await axios.delete(`${API_URL}/notes/${id}`);
    await loadNotes();
  } catch (error) {
    console.error('Error al eliminar nota:', error);
  }
};

// Función para cambiar entre pestañas
window.showTab = (tab) => {
  const sections = {
    'tareas': document.getElementById('tareas-section'),
    'notas': document.getElementById('notas-section')
  };
  const buttons = {
    'tareas': document.getElementById('tab-tareas'),
    'notas': document.getElementById('tab-notas')
  };

  Object.values(sections).forEach(section => section.classList.add('hidden'));
  Object.values(buttons).forEach(button => button.classList.remove('active'));

  sections[tab].classList.remove('hidden');
  buttons[tab].classList.add('active');
};

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  loadNotes();
});