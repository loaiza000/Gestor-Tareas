import { Router } from "express";
import tareaController from "../controller/tareas.controller.js";
import { authClient } from "../middleware/aut.middleware.js";

const tareaRouter = Router();

// Todas las rutas de tareas requieren autenticación
tareaRouter.use(authClient());

// Rutas básicas de tareas
tareaRouter.get('/', tareaController.getTareas);
tareaRouter.post('/', tareaController.postTareas);
tareaRouter.put('/:id', tareaController.updateTarea);
tareaRouter.delete('/:id', tareaController.deleteTarea);

// Rutas de colaboración
tareaRouter.post('/:id/asignar', tareaController.asignarUsuarios);
tareaRouter.get('/:id/asignados', tareaController.getUsuariosAsignados);

// Rutas de comentarios
tareaRouter.post('/:id/comentarios', tareaController.agregarComentario);
tareaRouter.get('/:id/comentarios', tareaController.getComentarios);
tareaRouter.delete('/:id/comentarios/:comentarioId', tareaController.eliminarComentario);

export default tareaRouter;
