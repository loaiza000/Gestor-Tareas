import express from "express";
import comentarioController from "../controller/comentario.controller.js";

const comentarioRouter = express.Router();

comentarioRouter.get("/", comentarioController.getAllComentarios);

comentarioRouter.get("/:id", comentarioController.getComentarioById);

comentarioRouter.post("/", comentarioController.postComentario);

comentarioRouter.put("/:id", comentarioController.updateComentario);

comentarioRouter.delete("/:id", comentarioController.deleteComentario);

comentarioRouter.get(
  "/usuario/:id",
  comentarioController.getComentariosByUsuario
);

export default comentarioRouter;
