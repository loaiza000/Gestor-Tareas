import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1:27017/gestionTareas";

export const connectDB = async () => {
  try {
    const db = await mongoose.connect(uri);
    console.log("Base de datos conectada:", db.connection.name);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
  }
};