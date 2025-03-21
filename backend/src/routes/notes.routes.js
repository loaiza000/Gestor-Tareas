import { Router } from 'express';
import noteController from '../controller/note.controller.js';

const noteRouter = Router();

noteRouter.get('/', noteController.getAllNotes);
noteRouter.post('/', noteController.postNote);
noteRouter.delete('/:id', noteController.deleteNote);

export default noteRouter;