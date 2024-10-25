"use strict";
import User from "../entity/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const userFound = await userRepository.findOne({
      where: { email }
    });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email, password, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    // Verificar si el correo ya está en uso
    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    // Verificar si el RUT ya está registrado
    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    // Crear un nuevo usuario con el rol proporcionado
    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(password),
      rol, // Asegúrate de que el rol se guarde correctamente
    });

    await userRepository.save(newUser);

    const { password: _, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
