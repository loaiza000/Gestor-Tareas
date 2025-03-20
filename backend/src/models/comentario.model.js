import mongoose from "mongoose";

const { model, Schema } = mongoose;

const comentarioSchema = new Schema(
  {
    contenido: {
      type: String,
      required: [true, "El campo contenido es requerido"],
    },
    usuario: { type: mongoose.Types.ObjectId, ref: "usuario" },
    tareas: { type: mongoose.Types.ObjectId, ref: "tareas" },
    fecha: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const comentarioModel = model("comentario", comentarioSchema);
