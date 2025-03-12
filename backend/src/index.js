import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import tareaRouter from "./routes/tarea.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../../../frontend/src")));

// API Routes
app.use("/tarea", tareaRouter);

// Ruta para el frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/src/index.html"));
});

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/gestionTareas", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto", app.get("port"));
});
