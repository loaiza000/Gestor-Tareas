import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { comentarioModel } from "../models/comentario.model.js";
import { tareaModel } from "../models/tareas.model.js";

const comentarioController = {};

comentarioController.getAllComentarios = async (req, res) => {
  try {
    const comentarios = await comentarioModel
      .find()
      .populate("usuario", "email nombre")
      .populate("tareas", "titulo descripcion estado");
    if (comentarios.length === 0) {
      return response(res, 404, false, "", "No hay comentarios registrados");
    }

    return response(res, 200, true, comentarios, "Comentarios registrados");
  } catch (error) {
    return handleError(res, error);
  }
};

comentarioController.getComentarioById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const comentarioFound = await comentarioModel.findById({ _id: id });
    if (!comentarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el comentario con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      comentarioFound,
      `Comentario encontrado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

comentarioController.postComentario = async (req, res) => {
  try {
    const { contenido, usuario, tareas } = req.body;

    if (!contenido || !usuario || !tareas) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (email, nombre y password) son requeridos"
      );
    }

    const userFound = await usuarioModel.findById({ _id: usuario });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el usuario con el id ${usuario}`
      );
    }

    const tareaFound = await tareaModel.findById({ _id: tareas });
    if (!tareaFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro la tarea con el id ${tareas}`
      );
    }

    const nuevoComentario = await comentarioModel.create(req.body);
    return response(res, 201, true, nuevoComentario, "Comentario creado");
  } catch (error) {
    return handleError(res, error);
  }
};

comentarioController.updateComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, usuario, tareas } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const comentarioFound = await comentarioModel.findById({ _id: id });
    if (!comentarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el comentario con el id ${id}`
      );
    }

    if (!contenido || !usuario || !tareas) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (email, nombre y password) son requeridos"
      );
    }

    if (comentarioFound.usuario != usuario) {
      const userFound = await usuarioModel.findById({ _id: usuario });
      if (!userFound) {
        return response(
          res,
          404,
          false,
          "",
          `No se encontro el usuario con el id ${usuario}`
        );
      }
    }

    if (comentarioFound.tareas != tareas) {
      const tareaFound = await tareaModel.findById({ _id: tareas });
      if (!tareaFound) {
        return response(
          res,
          404,
          false,
          "",
          `No se encontro la tarea con el id ${tareas}`
        );
      }
    }

    await comentarioFound.updateOne(req.body);
    return response(
      res,
      200,
      true,
      "",
      `El comentario con el id ${id} se actualizo`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

comentarioController.deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const comentarioFound = await comentarioModel.findById({ _id: id });
    if (!comentarioFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el comentario con el id ${id}`
      );
    }

    await comentarioFound.deleteOne();
    return response(
      res,
      200,
      true,
      "",
      `El comentario con el id ${id} fue eliminado`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

comentarioController.getComentariosByUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es válido para la base de datos`
      );
    }

    const userFound = await usuarioModel.findById(id);
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontró el usuario con el id ${id}`
      );
    }

    const comentarios = await comentarioModel.find({ usuario: id });
    if (comentarios.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `El usuario con id ${id} no tiene comentarios`
      );
    }

    return response(
      res,
      200,
      true,
      comentarios,
      "Comentarios obtenidos exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default comentarioController;
