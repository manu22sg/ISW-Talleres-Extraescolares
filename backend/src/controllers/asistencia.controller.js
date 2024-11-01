"use strict";
import { obtenerInscritosSesionService, registrarAsistenciaService } from "../services/asistencia.service.js";
import { actualizarEstadoAsistenciaService } from "../services/asistencia.service.js";

// Controlador para obtener la lista de estudiantes inscritos en una sesión específica
export async function obtenerInscritosSesion(req, res) {
  const { tallerId, sesionId } = req.params;

  const result = await obtenerInscritosSesionService(tallerId, sesionId);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}

// Controlador para registrar o actualizar la asistencia en una sesión
export async function registrarAsistencia(req, res) {
  const { tallerId, sesionId } = req.params;
  const { asistencias } = req.body; // Array de { usuarioId, estado, comentarios }

  const result = await registrarAsistenciaService(tallerId, sesionId, asistencias);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}

export async function actualizarEstadoAsistencia(req, res) {
  const { tallerId, sesionId, usuarioId } = req.params;
  const { nuevoEstado, comentarios } = req.body;
  const idProfesor = req.user.id; // Obtener el ID del profesor desde el token JWT

  const result = await actualizarEstadoAsistenciaService(tallerId, sesionId, usuarioId, 
    nuevoEstado, comentarios, idProfesor);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}
