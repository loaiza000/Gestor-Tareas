import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { model, Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      unique: true,
    },
    nombre: { type: String, required: [true, "El campo nombre es requerido"] },
    password: {
      type: String,
      required: [true, "El campo password es requerido"],
    },
    tareasCreadas: [{ type: mongoose.Types.ObjectId, ref: "tareas" }],
    tareasAsignadas: [{ type: mongoose.Types.ObjectId, ref: "tareas" }],
  },
  {
    timestamps: true,
  }
);

// Hash de la contraseña antes de guardar
usuarioSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const usuarioModel = model("usuario", usuarioSchema);
