"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id } = query;  // Solo usamos el id de la consulta

    const userRepository = AppDataSource.getRepository(User);

    // Buscar el usuario por ID
    const userFound = await userRepository.findOne({ where: { id } });

    if (!userFound) return [null, "Usuario no encontrado"];

    // Verificar si se está actualizando el rut o el email, y si ya existen
    if (body.rut || body.email) {
      const existingUser = await userRepository.findOne({
        where: [
          { rut: body.rut, id: Not(id) }, // Buscar rut que ya exista pero no del mismo usuario
          { email: body.email, id: Not(id) } // Buscar email que ya exista pero no del mismo usuario
        ],
      });

      if (existingUser) {
        return [null, "Ya existe un usuario con el mismo rut o email"];
      }
    }

    // Si se proporciona nueva contraseña, cifrarla
    if (body.newPassword && body.newPassword.trim() !== "") {
      body.password = await encryptPassword(body.newPassword);
    }

    // Preparar los datos para actualizar
    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto || userFound.nombreCompleto,
      rut: body.rut || userFound.rut,
      email: body.email || userFound.email,
      rol: body.rol || userFound.rol,
      password: body.password || userFound.password, // Solo si se ha actualizado
      updatedAt: new Date(),
    };

    // Actualizar el usuario
    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    // Obtener los datos actualizados
    const userData = await userRepository.findOne({ where: { id: userFound.id } });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    // Excluir la contraseña del resultado
    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}


export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}