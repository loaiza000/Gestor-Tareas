const axios = require('axios');

const API_URL = 'http://localhost:4001/tarea';
const SERVER_URL = process.env.SERVER_URL || API_URL;

const renderTareas = (tareas) => {
  const lista = document.getElementById('lista-tareas');
  if (!lista) return;

  lista.innerHTML = '';

  tareas.forEach(tarea => {
    const div = document.createElement('div');
    div.className = 'bg-gray-700/50 backdrop-blur-lg p-6 rounded-xl shadow-md mb-4 border border-gray-600 transition-all duration-200 hover:shadow-lg hover:border-gray-500 hover:-translate-y-[1px]';

    const estadoClases = {
      'Pendiente': 'bg-yellow-900 text-yellow-200 border-yellow-700',
      'En progreso': 'bg-blue-900 text-blue-200 border-blue-700',
      'Finalizada': 'bg-green-900 text-green-200 border-green-700'
    };

    div.innerHTML = `
      <div class="flex justify-between items-start gap-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-white mb-2">${tarea.titulo}</h3>
          <p class="text-gray-300 mb-4">${tarea.descripcion}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <select 
            class="px-4 py-2 rounded-lg border-2 ${estadoClases[tarea.estado]} cursor-pointer focus:ring-2 focus:ring-gray-500 transition-all duration-200 bg-opacity-50" 
            onchange="actualizarEstado('${tarea._id}', this.value)">
            <option value="Pendiente" ${tarea.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="En progreso" ${tarea.estado === 'En progreso' ? 'selected' : ''}>En progreso</option>
            <option value="Finalizada" ${tarea.estado === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
          </select>
          
          <button 
            onclick="eliminarTarea('${tarea._id}')" 
            class="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-red-900 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-600">
            Eliminar
          </button>
        </div>
      </div>
    `;

    lista.appendChild(div);
  });
};

const cargarTareas = async () => {
  try {
    const { data } = await axios.get(SERVER_URL);
    if (data.ok) {
      renderTareas(data.data);
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    mostrarError('No se pudo conectar con el servidor. Asegúrate de que el servidor esté funcionando.');
  }
};

const crearTarea = async () => {
  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!titulo || !descripcion) {
    mostrarError('Por favor completa todos los campos');
    return;
  }

  try {
    const { data } = await axios.post(SERVER_URL, {
      titulo,
      descripcion,
      estado: 'Pendiente'
    });

    if (data.ok) {
      document.getElementById('titulo').value = '';
      document.getElementById('descripcion').value = '';
      await cargarTareas();
    }
  } catch (error) {
    console.error('Error al crear tarea:', error);
    mostrarError('Error al crear la tarea. Verifica la conexión con el servidor.');
  }
};

const actualizarEstado = async (id, estado) => {
  try {
    const { data } = await axios.put(`${SERVER_URL}/${id}`, { estado });
    if (data.ok) {
      await cargarTareas();
    }
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    mostrarError('Error al actualizar el estado. Verifica la conexión con el servidor.');
  }
};

const eliminarTarea = async (id) => {
  try {
    const { data } = await axios.delete(`${SERVER_URL}/${id}`);
    if (data.ok) {
      await cargarTareas();
    }
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    mostrarError('Error al eliminar la tarea. Verifica la conexión con el servidor.');
  }
};

const mostrarError = (mensaje) => {
  // Crear el elemento de error si no existe
  let errorDiv = document.getElementById('error-mensaje');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-mensaje';
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 translate-x-full';
    document.body.appendChild(errorDiv);
  }

  // Mostrar el mensaje
  errorDiv.textContent = mensaje;
  errorDiv.classList.remove('translate-x-full');

  // Ocultar después de 3 segundos
  setTimeout(() => {
    errorDiv.classList.add('translate-x-full');
  }, 3000);
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarTareas();
  document.getElementById('btnCrear').addEventListener('click', crearTarea);
});

// Hacer las funciones disponibles globalmente
window.actualizarEstado = actualizarEstado;
window.eliminarTarea = eliminarTarea;