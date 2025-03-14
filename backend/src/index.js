import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./database.js";
import tareaRouter from "./routes/tarea.routes.js";
import notesRouter from "./routes/notes.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("port", process.env.PORT || 4001);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use("/tarea", tareaRouter);
app.use("/notes", notesRouter);

// Connect to database
connectDB();

app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
