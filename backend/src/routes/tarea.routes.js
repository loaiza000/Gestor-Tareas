import { Router } from "express";
import tareaController from "../controller/tareas.controller.js";
import { authClient } from "../middleware/aut.middleware.js";

const tareaRouter = Router();

tareaRouter.use(authClient());
tareaRouter.get('/', tareaController.getTareas);
tareaRouter.post('/', tareaController.postTareas);
tareaRouter.put('/:id', tareaController.updateTarea);
tareaRouter.delete('/:id', tareaController.deleteTarea);
tareaRouter.post('/:id/asignar', tareaController.asignarUsuarios);
tareaRouter.get('/:id/asignados', tareaController.getUsuariosAsignados);
tareaRouter.post('/:id/comentarios', tareaController.agregarComentario);
tareaRouter.get('/:id/comentarios', tareaController.getComentarios);
tareaRouter.delete('/:id/comentarios/:comentarioId', tareaController.eliminarComentario);

export default tareaRouter;
