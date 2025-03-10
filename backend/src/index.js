import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tareaRouter from "./routes/tarea.routes.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/tarea", tareaRouter);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/gestionaTareas", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(app.get("port"), () => {
  console.log("Escuchando por el puerto", app.get("port"));
});
