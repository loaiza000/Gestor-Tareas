import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { tareaModel } from "../models/tareas.model.js";
import { usuarioModel } from "../models/usuario.model.js";

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
        "Los campos titulo y descripcion son requeridos"
      );
    }

    const nuevaTarea = new tareaModel({
      titulo,
      descripcion,
      creador: req.user.id,
      estado: "pendiente"
    });

    await nuevaTarea.save();
    return response(res, 201, true, nuevaTarea, "Tarea creada exitosamente");
  } catch (error) {
    console.error('Error al crear tarea:', error);
    return handleError(res, error);
  }
};

tareaController.updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Verificar que el usuario sea el creador o esté asignado
    if (tarea.creador.toString() !== req.user.id && 
        !tarea.asignados.includes(req.user.id)) {
      return response(
        res,
        403,
        false,
        null,
        "No tienes permiso para modificar esta tarea"
      );
    }

    const tareaActualizada = await tareaModel.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true }
    );

    return response(
      res,
      200,
      true,
      tareaActualizada,
      "Tarea actualizada exitosamente"
    );
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return handleError(res, error);
  }
};

tareaController.deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Solo el creador puede eliminar la tarea
    if (tarea.creador.toString() !== req.user.id) {
      return response(
        res,
        403,
        false,
        null,
        "Solo el creador puede eliminar la tarea"
      );
    }

    await tareaModel.findByIdAndDelete(id);
    return response(res, 200, true, null, "Tarea eliminada exitosamente");
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return handleError(res, error);
  }
};

// Funciones para manejo de asignaciones
tareaController.asignarUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarios } = req.body;

    if (!usuarios || !Array.isArray(usuarios)) {
      return response(
        res,
        400,
        false,
        null,
        "Se requiere un array de IDs de usuarios"
      );
    }

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Solo el creador puede asignar usuarios
    if (tarea.creador.toString() !== req.user.id) {
      return response(
        res,
        403,
        false,
        null,
        "Solo el creador puede asignar usuarios"
      );
    }

    // Verificar que los usuarios existan
    const usuariosExistentes = await usuarioModel.find({
      _id: { $in: usuarios }
    });

    if (usuariosExistentes.length !== usuarios.length) {
      return response(
        res,
        400,
        false,
        null,
        "Algunos usuarios no existen"
      );
    }

    tarea.asignados = usuarios;
    await tarea.save();

    return response(
      res,
      200,
      true,
      tarea,
      "Usuarios asignados exitosamente"
    );
  } catch (error) {
    console.error('Error al asignar usuarios:', error);
    return handleError(res, error);
  }
};

// Obtener usuarios asignados a una tarea
tareaController.getUsuariosAsignados = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await tareaModel.findById(id)
      .populate('asignados', 'nombre email');

    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Verificar que el usuario tenga acceso a la tarea
    if (tarea.creador.toString() !== req.user.id && 
        !tarea.asignados.some(u => u._id.toString() === req.user.id)) {
      return response(
        res,
        403,
        false,
        null,
        "No tienes permiso para ver los usuarios asignados a esta tarea"
      );
    }

    return response(
      res,
      200,
      true,
      tarea.asignados,
      "Lista de usuarios asignados"
    );
  } catch (error) {
    console.error('Error al obtener usuarios asignados:', error);
    return handleError(res, error);
  }
};

// Funciones para manejo de comentarios
tareaController.agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    if (!contenido) {
      return response(
        res,
        400,
        false,
        null,
        "El contenido del comentario es requerido"
      );
    }

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Verificar que el usuario tenga acceso a la tarea
    if (tarea.creador.toString() !== req.user.id && 
        !tarea.asignados.includes(req.user.id)) {
      return response(
        res,
        403,
        false,
        null,
        "No tienes permiso para comentar en esta tarea"
      );
    }

    const comentario = {
      usuario: req.user.id,
      contenido,
      fecha: new Date()
    };

    tarea.comentarios.push(comentario);
    await tarea.save();

    return response(
      res,
      201,
      true,
      comentario,
      "Comentario agregado exitosamente"
    );
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    return handleError(res, error);
  }
};

// Obtener comentarios de una tarea
tareaController.getComentarios = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await tareaModel.findById(id)
      .populate({
        path: 'comentarios.usuario',
        select: 'nombre email'
      });

    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    // Verificar que el usuario tenga acceso a la tarea
    if (tarea.creador.toString() !== req.user.id && 
        !tarea.asignados.some(u => u._id.toString() === req.user.id)) {
      return response(
        res,
        403,
        false,
        null,
        "No tienes permiso para ver los comentarios de esta tarea"
      );
    }

    return response(
      res,
      200,
      true,
      tarea.comentarios,
      "Lista de comentarios"
    );
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return handleError(res, error);
  }
};

// Eliminar un comentario
tareaController.eliminarComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, null, "Tarea no encontrada");
    }

    const comentario = tarea.comentarios.id(comentarioId);
    if (!comentario) {
      return response(res, 404, false, null, "Comentario no encontrado");
    }

    // Solo el creador del comentario o de la tarea puede eliminarlo
    if (comentario.usuario.toString() !== req.user.id && 
        tarea.creador.toString() !== req.user.id) {
      return response(
        res,
        403,
        false,
        null,
        "No tienes permiso para eliminar este comentario"
      );
    }

    // Actualizar usando pull para remover el comentario del array
    tarea.comentarios.pull({ _id: comentarioId });
    await tarea.save();

    return response(
      res,
      200,
      true,
      null,
      "Comentario eliminado exitosamente"
    );
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return handleError(res, error);
  }
};

export default tareaController;
