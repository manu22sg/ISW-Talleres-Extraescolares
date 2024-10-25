"use strict";
import Sesion from "../entity/sesion.entity.js";
import Taller from "../entity/taller.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function crearSesion(req, res) {
  try {
    const { taller_id } = req.params;
    const { fecha, estado } = req.body;

    // Verificar que el usuario sea un profesor
    if (req.user.rol !== "profesor") {
      return handleErrorClient(res, 403, "No tienes permisos para crear una sesión");
    }

    // Verificar que el taller exista
    const tallerRepository = AppDataSource.getRepository(Taller);
    const taller = await tallerRepository.findOne({ where: { id: taller_id } });

    if (!taller) {
      return handleErrorClient(res, 404, "Taller no encontrado");
    }

    // Crear una nueva sesión
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const nuevaSesion = sesionRepository.create({
      fecha,
      estado,
      taller_id: taller.id,
    });

    await sesionRepository.save(nuevaSesion);

    handleSuccess(res, 201, "Sesión creada con éxito", nuevaSesion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
