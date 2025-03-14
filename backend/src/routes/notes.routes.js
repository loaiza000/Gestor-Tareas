import { Router } from 'express';
import noteController from '../controller/noteController.js';

const noteRouter = Router();

// Get all notes
noteRouter.get('/', noteController.getAllNotes);

// Create a new note
noteRouter.post('/', noteController.postNote);

// Delete a note
noteRouter.delete('/:id', noteController.deleteNote);

export default noteRouter;