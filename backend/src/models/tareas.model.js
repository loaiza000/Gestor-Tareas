import mongoose from "mongoose";

const { model, Schema } = mongoose;

const tareaSchema = new Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Pendiente", "En progreso", "Completada"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  }
);

export const tareaModel = model("tareas", tareaSchema);
