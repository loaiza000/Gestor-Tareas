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
    creador: { type: mongoose.Types.ObjectId, ref: "usuario" },
    asignados: { type: mongoose.Types.ObjectId, ref: "usuario" },
    colaboradores: { type: mongoose.Types.ObjectId, ref: "usuario" },
    comentarios: { type: mongoose.Types.ObjectId, ref: "comentario" },
  },
  {
    timestamps: true,
  }
);

export const tareaModel = model("tareas", tareaSchema);
