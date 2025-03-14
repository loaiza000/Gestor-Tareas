import { noteModel } from '../models/note.model.js';
import { response } from '../helpers/response.js';
import { handleError } from '../helpers/error.handler.js';

const noteController = {
    getAllNotes: async (req, res) => {
        try {
            const notes = await noteModel.find().sort({ createdAt: -1 });
            console.log('Notas encontradas:', notes);
            return response(res, 200, true, notes, "Lista de notas");
        } catch (error) {
            console.error('Error al obtener notas:', error);
            return handleError(res, error);
        }
    },

    postNote: async (req, res) => {
        try {
            const { title, content } = req.body;
            console.log('Creando nota:', { title, content });
            if (!title || !content) {
                return response(res, 400, false, "", "Todos los campos son requeridos");
            }
            const newNote = await noteModel.create(req.body);
            console.log('Nueva nota creada:', newNote);
            return response(res, 201, true, newNote, "Nota creada");
        } catch (error) {
            console.error('Error al crear nota:', error);
            return handleError(res, error);
        }
    },

    deleteNote: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Eliminando nota:', id);
            const deletedNote = await noteModel.findByIdAndDelete(id);
            if (!deletedNote) {
                return response(res, 404, false, "", "Nota no encontrada");
            }
            console.log('Nota eliminada:', deletedNote);
            return response(res, 200, true, deletedNote, "Nota eliminada");
        } catch (error) {
            console.error('Error al eliminar nota:', error);
            return handleError(res, error);
        }
    }
};

export default noteController;
