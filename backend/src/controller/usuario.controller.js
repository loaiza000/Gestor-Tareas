import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { encryptPassword } from "../helpers/encrypt.password.js";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { usuarioModel } from "../models/usuario.model.js";
import { tareaModel } from "../models/tareas.model.js";

const usuarioController = {};

// Registro de usuario
usuarioController.register = async (req, res) => {
  try {
    const { email, nombre, password } = req.body;

    if (!email || !nombre || !password) {
      return response(
        res,
        400,
        false,
        null,
        "Los campos (email, nombre y password) son requeridos"
      );
    }

    const emailFound = await usuarioModel.findOne({ email: email });
    if (emailFound) {
      return response(
        res,
        400,
        false,
        null,
        `El email ${email} ya se encuentra en uso`
      );
    }

    if (password.length < 6) {
      return response(
        res,
        400,
        false,
        null,
        "El password debe tener al menos 6 caracteres"
      );
    }

    const newUser = new usuarioModel({
      nombre,
      email,
      password: encryptPassword(password),
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return response(
      res,
      201,
      true,
      {
        user: newUser.toJSON(),
        token,
      },
      "Usuario creado exitosamente"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// Login de usuario
usuarioController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Intento de login:', { email });

    if (!email || !password) {
      console.log('Faltan campos requeridos');
      return response(res, 400, false, null, "Email y password son requeridos");
    }

    const user = await usuarioModel.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email);
      return response(res, 401, false, null, "Credenciales inválidas");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Contraseña inválida para usuario:', email);
      return response(res, 401, false, null, "Credenciales inválidas");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'tu_secreto_seguro', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    console.log('Login exitoso:', { email });
    return response(res, 200, true, {
      token,
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    }, "Login exitoso");

  } catch (error) {
    console.error('Error en login:', error);
    return handleError(res, error);
  }
};

// Verificar token
usuarioController.verify = async (req, res) => {
  try {
    const user = await usuarioModel
      .findById(req.user.userId)
      .select("-password");

    if (!user) {
      return response(res, 404, false, null, "Usuario no encontrado");
    }

    return response(res, 200, true, { user }, "Token válido");
  } catch (error) {
    return handleError(res, error);
  }
};

// Obtener perfil del usuario
usuarioController.getProfile = async (req, res) => {
  try {
    const user = await usuarioModel
      .findById(req.user.userId)
      .select("-password")
      .populate("tareasCreadas", "titulo descripcion estado")
      .populate("tareasAsignadas", "titulo descripcion estado");

    if (!user) {
      return response(res, 404, false, null, "Usuario no encontrado");
    }

    return response(res, 200, true, { user }, "Perfil de usuario");
  } catch (error) {
    return handleError(res, error);
  }
};

// Obtener todos los usuarios (protegido)
usuarioController.getAllUsers = async (req, res) => {
  try {
    const users = await usuarioModel
      .find()
      .select("-password")
      .populate("tareasCreadas", "titulo descripcion estado")
      .populate("tareasAsignadas", "titulo descripcion estado");

    if (users.length === 0) {
      return response(res, 404, false, null, "No se encontraron usuarios");
    }

    return response(res, 200, true, { users }, "Lista de usuarios");
  } catch (error) {
    return handleError(res, error);
  }
};

// Obtener tareas del usuario
usuarioController.getTasksByUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response(res, 400, false, null, `ID de usuario inválido`);
    }

    const user = await usuarioModel.findById(userId);
    if (!user) {
      return response(res, 404, false, null, "Usuario no encontrado");
    }

    const tareas = await tareaModel
      .find({
        $or: [{ creador: userId }, { asignados: userId }],
      })
      .populate("creador", "nombre email")
      .populate("asignados", "nombre email");

    return response(res, 200, true, { tareas }, "Tareas del usuario");
  } catch (error) {
    return handleError(res, error);
  }
};

export default usuarioController;
