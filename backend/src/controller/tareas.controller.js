import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { tareaModel } from "../models/tareas.model.js";

const tareaController = {};

tareaController.getTareas = async (req, res) => {
  try {
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, tareas, "Lista de tareas");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.postTareas = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

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

    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 201, true, { nuevaTarea, tareas }, "Tarea creada");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

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

    if (estado && !['Pendiente', 'En progreso', 'Finalizada'].includes(estado)) {
      return response(
        res,
        400,
        false,
        null,
        "El estado debe ser: Pendiente, En progreso o Finalizada"
      );
    }

    const tareaActualizada = await tareaModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, { tareaActualizada, tareas }, "Tarea actualizada");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;

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
    return handleError(res, error);
  }
};

export default tareaController;
