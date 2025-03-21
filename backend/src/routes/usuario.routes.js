import express from "express";
import usuarioController from "../controller/usuario.controller.js";
import { authClient } from "../middleware/aut.middleware.js";

const usuarioRouter = express.Router();

usuarioRouter.post("/register", usuarioController.register);
usuarioRouter.post("/login", usuarioController.login);
usuarioRouter.get("/verify", authClient(), usuarioController.verify);
usuarioRouter.get("/profile", authClient(), usuarioController.getProfile);
usuarioRouter.get("/", authClient(), usuarioController.getAllUsers);
usuarioRouter.get("/tasks", authClient(), usuarioController.getTasksByUser);
usuarioRouter.get("/:id/tasks", authClient(), usuarioController.getTasksByUser);

export default usuarioRouter;
