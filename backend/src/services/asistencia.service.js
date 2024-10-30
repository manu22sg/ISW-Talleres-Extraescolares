"use strict";
import Sesion from "../entity/sesion.entity.js"; // Importa la entidad de Sesion
import Asistencia from "../entity/asistencia.entity.js"; // Importa la entidad de Asistencia
import User from "../entity/user.entity.js"; // Importa la entidad de Usuario
import { AppDataSource } from "../config/configDb.js"; // Fuente de datos de la BD

// Obtener lista de estudiantes inscritos para una sesión específica
export async function obtenerInscritosSesionService(tallerId, sesionId) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    // Buscar todos los registros de asistencia para esta sesión
    const asistencias = await asistenciaRepository.find({
      where: { tallerId, sesionId },
      relations: ["usuario"]
    });

    // Formatear la respuesta
    const estudiantes = asistencias.map((asistencia) => ({
      id: asistencia.usuario.id,
      nombreCompleto: asistencia.usuario.nombreCompleto,
      estado: asistencia.estado,
      comentarios: asistencia.comentarios
    }));

    return { success: true, estudiantes };
  } catch (error) {
    console.error("Error al obtener inscritos para la sesión:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}


// Registrar o actualizar asistencia para una sesión
export async function registrarAsistenciaService(tallerId, sesionId, asistencias) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    // Verificar que la sesión pertenece al taller especificado
    const sesion = await sesionRepository.findOne({
      where: { id: sesionId, taller: { id: tallerId } },
    });
    if (!sesion) return { error: "Sesión o taller no encontrado", statusCode: 404 };

    // Procesar cada registro de asistencia
    for (const { usuarioId, estado, comentarios } of asistencias) {
      // Buscar si ya existe un registro de asistencia para esta sesión y usuario
      let registroAsistencia = await asistenciaRepository.findOne({
        where: { sesionId, usuarioId },
      });

      if (registroAsistencia) {
        // Actualizar el registro existente
        registroAsistencia.estado = estado;
        registroAsistencia.comentarios = comentarios;
      } else {
        // Crear un nuevo registro de asistencia
        registroAsistencia = asistenciaRepository.create({
          tallerId,
          sesionId,
          usuarioId,
          estado,
          comentarios,
        });
      }
      await asistenciaRepository.save(registroAsistencia);
    }

    return { success: true, message: "Asistencia registrada correctamente" };
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}
