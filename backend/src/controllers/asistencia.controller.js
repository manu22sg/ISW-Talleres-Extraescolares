"use strict";
import { AppDataSource } from "../config/configDb.js";
import Asistencia from "../entity/asistencia.entity.js";
import Sesion from "../entity/sesion.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Registrar la asistencia de un estudiante
export async function registrarAsistencia(req, res) {
  try {
    const { sesion_id } = req.params;
    const { estudiante_id, estado, comentarios } = req.body;

    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const sesionRepository = AppDataSource.getRepository(Sesion);

    // Verificar si la sesión está en curso
    const sesion = await sesionRepository.findOne({ where: { sesion_id, estado: 'en curso' } });
    if (!sesion) return handleErrorClient(res, 400, "La sesión no está en curso o no existe.");

    // Registrar o actualizar la asistencia del estudiante
    const nuevaAsistencia = asistenciaRepository.create({ sesion_id, estudiante_id, estado, comentarios });
    await asistenciaRepository.save(nuevaAsistencia);

    handleSuccess(res, 201, "Asistencia registrada exitosamente.", nuevaAsistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener la lista de asistencia de una sesión
export async function obtenerAsistenciaPorSesion(req, res) {
  try {
    const { sesion_id } = req.params;
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    const asistencia = await asistenciaRepository.find({ where: { sesion_id } });
    if (!asistencia.length) return handleErrorClient(res, 404, "No se encontró asistencia para la sesión especificada.");

    handleSuccess(res, 200, "Asistencia obtenida exitosamente.", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Finalizar la sesión para bloquear cambios en la asistencia
export async function finalizarSesion(req, res) {
  try {
    const { sesion_id } = req.params;
    const sesionRepository = AppDataSource.getRepository(Sesion);

    const sesion = await sesionRepository.findOne({ where: { sesion_id } });
    if (!sesion) return handleErrorClient(res, 404, "La sesión no existe.");

    // Cambiar el estado de la sesión a "finalizada"
    sesion.estado = "finalizada";
    await sesionRepository.save(sesion);

    handleSuccess(res, 200, "La sesión ha sido finalizada.", sesion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
