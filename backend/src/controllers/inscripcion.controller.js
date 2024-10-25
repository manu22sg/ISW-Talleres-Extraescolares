"use strict";
import Inscripcion from "../entity/inscripcion.entity.js";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function inscribirEstudiante(req, res) {
  try {
    const { taller_id } = req.params;
    const { estudiante_id } = req.body;

    // Verificar que el usuario tenga el rol de "alumno"
    if (req.user.rol !== "alumno") {
      return handleErrorClient(res, 403, "No tienes permisos para inscribirte en un taller");
    }

    // Verificar que el taller exista
    const tallerRepository = AppDataSource.getRepository(Taller);
    const taller = await tallerRepository.findOne({ where: { id: taller_id } });

    if (!taller) {
      return handleErrorClient(res, 404, "Taller no encontrado");
    }

    // Verificar que el estudiante exista
    const userRepository = AppDataSource.getRepository(User);
    const estudiante = await userRepository.findOne({ where: { id: estudiante_id, rol: "alumno" } });

    if (!estudiante) {
      return handleErrorClient(res, 404, "Estudiante no encontrado o no es un alumno");
    }

    // Verificar si el estudiante ya está inscrito en el taller
    const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
    const inscripcionExistente = await inscripcionRepository.findOne({ where: { taller_id, estudiante_id } });

    if (inscripcionExistente) {
      return handleErrorClient(res, 409, "El estudiante ya está inscrito en este taller");
    }

    // Crear una nueva inscripción
    const nuevaInscripcion = inscripcionRepository.create({
      taller_id,
      estudiante_id,
    });

    await inscripcionRepository.save(nuevaInscripcion);

    handleSuccess(res, 201, "Inscripción realizada con éxito", nuevaInscripcion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
