"use strict";
import Taller from "../entity/taller.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient, handleErrorServer, handleSuccess   } from "../handlers/responseHandlers.js";

export async function crearTaller(req, res) {
  try {
    const { nombre, descripcion, profesor_id } = req.body;

    // Verificar que el usuario sea un profesor
    if (req.user.rol !== "profesor") {
      return handleErrorClient(res, 403, "No tienes permisos para crear un taller");
    }

    // Crear un nuevo taller
    const tallerRepository = AppDataSource.getRepository(Taller);
    const nuevoTaller = tallerRepository.create({
      nombre,
      descripcion,
      profesor_id,
    });

    await tallerRepository.save(nuevoTaller);

    handleSuccess(res, 201, "Taller creado con éxito", nuevoTaller);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
