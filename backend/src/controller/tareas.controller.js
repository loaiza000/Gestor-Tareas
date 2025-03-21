import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { tareaModel } from "../models/tareas.model.js";
import { usuarioModel } from "../models/usuario.model.js";

const tareaController = {};

tareaController.getTareas = async (req, res) => {
  try {
    const tareas = await tareaModel.find().sort({ createdAt: -1 });
    if (tareas.length === 0) {
      return response(res, 404, false, "", "No se encontraron tareas");
    }
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
        "",
        "Los campos titulo y descripcion son requeridos"
      );
    }

    const nuevaTarea = new tareaModel({
      titulo,
      descripcion,
      creador: req.user.id,
      estado: "pendiente",
    });

    await nuevaTarea.save();
    return response(res, 201, true, nuevaTarea, "Tarea creada exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.updateTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (
      tarea.creador.toString() !== req.user.id &&
      !tarea.asignados.includes(req.user.id)
    ) {
      return response(
        res,
        403,
        false,
        "",
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
    return handleError(res, error);
  }
};

tareaController.deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (tarea.creador.toString() !== req.user.id) {
      return response(
        res,
        403,
        false,
        "",
        "Solo el creador puede eliminar la tarea"
      );
    }

    await tareaModel.findByIdAndDelete(id);
    return response(res, 200, true, "", "Tarea eliminada exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.asignarUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarios } = req.body;

    if (!usuarios || !Array.isArray(usuarios)) {
      return response(
        res,
        400,
        false,
        "",
        "Se requiere un array de IDs de usuarios"
      );
    }

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (tarea.creador.toString() !== req.user.id) {
      return response(
        res,
        403,
        false,
        "",
        "Solo el creador puede asignar usuarios"
      );
    }

    const usuariosExistentes = await usuarioModel.find({
      _id: { $in: usuarios },
    });

    if (usuariosExistentes.length !== usuarios.length) {
      return response(res, 400, false, "", "Algunos usuarios no existen");
    }

    tarea.asignados = usuarios;
    await tarea.save();

    return response(res, 200, true, tarea, "Usuarios asignados exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.getUsuariosAsignados = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await tareaModel
      .findById(id)
      .populate("asignados", "nombre email");

    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (
      tarea.creador.toString() !== req.user.id &&
      !tarea.asignados.some((u) => u._id.toString() === req.user.id)
    ) {
      return response(
        res,
        403,
        false,
        "",
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
    return handleError(res, error);
  }
};

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
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (
      tarea.creador.toString() !== req.user.id &&
      !tarea.asignados.includes(req.user.id)
    ) {
      return response(
        res,
        403,
        false,
        "",
        "No tienes permiso para comentar en esta tarea"
      );
    }

    const comentario = {
      usuario: req.user.id,
      contenido,
      fecha: new Date(),
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
    return handleError(res, error);
  }
};

// Obtener comentarios de una tarea
tareaController.getComentarios = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await tareaModel.findById(id).populate({
      path: "comentarios.usuario",
      select: "nombre email",
    });

    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    if (
      tarea.creador.toString() !== req.user.id &&
      !tarea.asignados.some((u) => u._id.toString() === req.user.id)
    ) {
      return response(
        res,
        403,
        false,
        "",
        "No tienes permiso para ver los comentarios de esta tarea"
      );
    }

    return response(res, 200, true, tarea.comentarios, "Lista de comentarios");
  } catch (error) {
    return handleError(res, error);
  }
};

tareaController.eliminarComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;

    const tarea = await tareaModel.findById(id);
    if (!tarea) {
      return response(res, 404, false, "", "Tarea no encontrada");
    }

    const comentario = tarea.comentarios.id(comentarioId);
    if (!comentario) {
      return response(res, 404, false, "", "Comentario no encontrado");
    }

    if (
      comentario.usuario.toString() !== req.user.id &&
      tarea.creador.toString() !== req.user.id
    ) {
      return response(
        res,
        403,
        false,
        "",
        "No tienes permiso para eliminar este comentario"
      );
    }

    tarea.comentarios.pull({ _id: comentarioId });
    await tarea.save();

    return response(res, 200, true, "", "Comentario eliminado exitosamente");
  } catch (error) {
    return handleError(res, error);
  }
};

export default tareaController;
