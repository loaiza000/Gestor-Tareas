import { noteModel } from "../models/note.model.js";
import { response } from "../helpers/response.js";
import { handleError } from "../helpers/error.handler.js";

const noteController = {};

noteController.getAllNotes = async (req, res) => {
  try {
    const notes = await noteModel.find().sort({ createdAt: -1 });
    return response(res, 200, true, notes, "Lista de notas");
  } catch (error) {
    return handleError(res, error);
  }
};

noteController.postNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return response(res, 400, false, "", "Todos los campos son requeridos");
    }

    const newNote = await noteModel.create(req.body);
    return response(res, 201, true, newNote, "Nota creada");
  } catch (error) {
    return handleError(res, error);
  }
};

noteController.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await noteModel.findByIdAndDelete(id);
    if (!deletedNote) {
      return response(res, 404, false, "", "Nota no encontrada");
    }
    return response(res, 200, true, deletedNote, "Nota eliminada");
  } catch (error) {
    return handleError(res, error);
  }
};

export default noteController;
