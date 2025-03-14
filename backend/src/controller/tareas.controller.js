import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { tareaModel } from "../models/tareas.model.js";

const tareaController = {};

tareaController.getTareas = async (req, res) => {
  try {
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    console.log('Tareas encontradas:', tareas);
    return response(res, 200, true, tareas, "Lista de tareas");
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    return handleError(res, error);
  }
};

tareaController.postTareas = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    console.log('Creando tarea:', { titulo, descripcion });

    if (!titulo || !descripcion) {
      return response(
        res,
        400,
        false,
        null,
        "La descripcion y el titulo son obligatorios"
      );
    }

    const nuevaTarea = await tareaModel.create({
      titulo,
      descripcion,
      estado: 'Pendiente'
    });
    console.log('Nueva tarea creada:', nuevaTarea);

    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 201, true, { nuevaTarea, tareas }, "Tarea creada");
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return handleError(res, error);
  }
};

tareaController.updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    console.log('Actualizando tarea:', { id, estado });

    const tareaFound = await tareaModel.findById(id);
    if (!tareaFound) {
      return response(
        res,
        404,
        false,
        null,
        `No se encontró la tarea con el id ${id}`
      );
    }

    if (estado && !['Pendiente', 'En progreso', 'Completada'].includes(estado)) {
      return response(
        res,
        400,
        false,
        null,
        "El estado debe ser: Pendiente, En progreso o Completada"
      );
    }

    const tareaActualizada = await tareaModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    console.log('Tarea actualizada:', tareaActualizada);
    
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, { tareaActualizada, tareas }, "Tarea actualizada");
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return handleError(res, error);
  }
};

tareaController.deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando tarea:', id);

    const tareaFound = await tareaModel.findById(id);
    if (!tareaFound) {
      return response(
        res,
        404,
        false,
        null,
        `No se encontró la tarea con el id ${id}`
      );
    }

    await tareaModel.findByIdAndDelete(id);
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, { id, tareas }, "Tarea eliminada");
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return handleError(res, error);
  }
};

export default tareaController;
