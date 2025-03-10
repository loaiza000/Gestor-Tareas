import { Router } from "express";
import tareaController from "../controller/tareas.controller.js";

const tareaRouter = Router();

tareaRouter.get('/', tareaController.getTareas);
tareaRouter.post('/', tareaController.postTareas);
tareaRouter.put('/:id', tareaController.updateTarea);
tareaRouter.delete('/:id', tareaController.deleteTarea);

export default tareaRouter;
