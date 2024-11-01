"use strict";
import Sesion from "../entity/sesion.entity.js"; // Importa la entidad de Sesion
import Asistencia from "../entity/asistencia.entity.js"; // Importa la entidad de Asistencia
import Taller from "../entity/taller.entity.js";
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

// Servicio para actualizar el estado de la asistencia de un estudiante con validaciones adicionales
export async function actualizarEstadoAsistenciaService(tallerId, sesionId, 
  usuarioId, nuevoEstado, comentarios, idProfesor) {
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    // Validar si el taller existe y obtener el profesor asociado
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["profesor"]
    });
    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para actualizar la asistencia en este taller", statusCode: 403 };
    }

    // Validar si la sesión existe y está asociada con el taller
    const sesion = await sesionRepository.findOne({
      where: { id: sesionId, taller: { id: tallerId } }
    });
    if (!sesion) {
      return { error: "Sesión no encontrada o no asociada con el taller", statusCode: 404 };
    }

    // Buscar el registro de asistencia correspondiente
    const registroAsistencia = await asistenciaRepository.findOne({
      where: { tallerId, sesionId, usuarioId }
    });
    if (!registroAsistencia) {
      return { error: "Registro de asistencia no encontrado", statusCode: 404 };
    }

    // Actualizar el estado y los comentarios
    registroAsistencia.estado = nuevoEstado;
    if (comentarios) {
      registroAsistencia.comentarios = comentarios;
    }

    // Guardar los cambios en la base de datos
    await asistenciaRepository.save(registroAsistencia);

    return { success: true, message: "Estado de asistencia actualizado correctamente" };
  } catch (error) {
    console.error("Error al actualizar el estado de asistencia:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}