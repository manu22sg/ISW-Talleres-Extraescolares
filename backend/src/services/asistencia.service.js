"use strict";
import Sesion from "../entity/sesion.entity.js"; // Importa la entidad de Sesion
import Asistencia from "../entity/asistencia.entity.js"; // Importa la entidad de Asistencia
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js"; // Importa la entidad de Usuario
import { AppDataSource } from "../config/configDb.js"; // Fuente de datos de la BD

// Obtener lista de estudiantes inscritos para una sesión específica
export async function obtenerInscritosSesionService(tallerId, sesionId, idProfesor) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

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
      return { error: "No está autorizado para acceder a los inscritos de este taller", statusCode: 403 };
    }

    // Validar si la sesión existe y está asociada con el taller
    const sesion = await sesionRepository.findOne({
      where: { id: sesionId, taller: { id: tallerId } }
    });
    if (!sesion) {
      return { error: "Sesión no encontrada o no asociada con el taller", statusCode: 404 };
    }

    // Buscar todos los registros de asistencia para esta sesión
    const asistencias = await asistenciaRepository.find({
      where: { sesionId, tallerId },
      relations: ["usuario"]
    });

    // Formatear la respuesta
    const estudiantes = asistencias.map(asistencia => ({
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
export async function registrarAsistenciaService(tallerId, sesionId, asistencias, idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);

    // Validar si el taller existe y obtener el profesor asociado
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["profesor"],
    });
    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para registrar asistencia en este taller", statusCode: 403 };
    }

    // Validar si la sesión existe y está asociada con el taller
    const sesion = await sesionRepository.findOne({
      where: { id: sesionId, taller: { id: tallerId } },
    });
    if (!sesion) {
      return { error: "Sesión no encontrada o no asociada con el taller", statusCode: 404 };
    }

    //verificar si existe asistencia al taller

    

    // Procesar cada registro de asistencia
    for (const { usuarioId, estado, comentarios } of asistencias) {
      // Validar si el estudiante existe y tiene el rol adecuado
      const usuario = await userRepository.findOne({
        where: { rut: usuarioId, rol: "estudiante" },
      });
      if (!usuario) {
        return { error: "Estudiante no encontrado o no tiene el rol de estudiante", statusCode: 404 };
      }

      // Verificar si ya existe un registro de asistencia para esta sesión y usuario
      const registroExistente = await asistenciaRepository.findOne({
        where: { sesionId, usuarioId: usuario.id }, // Usa usuario.id directamente
      });
      if (registroExistente) {
        return { error: "La asistencia para este estudiante ya ha sido registrada", statusCode: 400 };
      }

      // Crear un nuevo registro de asistencia
      const nuevoRegistroAsistencia = asistenciaRepository.create({
        tallerId,
        sesionId,
        usuarioId: usuario.id, // Usa usuario.id directamente
        estado,
        comentarios,
      });
      await asistenciaRepository.save(nuevoRegistroAsistencia);
    }

    return { success: true, message: "Asistencia registrada correctamente" };
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}


// Servicio para actualizar el estado de la asistencia de un estudiante con validaciones adicionales
export async function actualizarEstadoAsistenciaService(
  tallerId, sesionId, usuarioId, nuevoEstado, comentarios, idProfesor
) {
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const userRepository = AppDataSource.getRepository(User);

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

    // Validar si el usuario (estudiante) existe y tiene el rol adecuado
    const usuario = await userRepository.findOne({
      where: { id: usuarioId, rol: "estudiante" }
    });
    if (!usuario) {
      return { error: "Estudiante no encontrado o no tiene el rol de estudiante", statusCode: 404 };
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


// Servicio para que los estudiantes registren asistencia usando el token
export async function registrarAsistenciaConTokenService(tallerId, sesionId, usuarioId, tokenAsistencia) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const userRepository = AppDataSource.getRepository(User);

    // Validar si la sesión existe y está asociada con el taller
    const sesion = await sesionRepository.findOne({
      where: { id: sesionId, taller: { id: tallerId } },
    });
    if (!sesion) {
      return { error: "Sesión no encontrada o no asociada con el taller", statusCode: 404 };
    }

    // Verificar si el token de asistencia es válido
    if (sesion.tokenAsistencia !== parseInt(tokenAsistencia, 10)) {
      return { error: "Token de asistencia inválido", statusCode: 403 };
    }

    // Verificar si el token de asistencia ha expirado
    const now = new Date();
    if (now > new Date(sesion.expiracionToken)) {
      return { error: "El token de asistencia ha expirado", statusCode: 403 };
    }

    // Validar si el estudiante existe y tiene el rol adecuado
    console.log(usuarioId);
    const usuario = await userRepository.findOne({
      where: { id: usuarioId, rol: "estudiante" },
    });
    if (!usuario) {
      return { error: "Estudiante no encontrado o no tiene el rol de estudiante", statusCode: 404 };
    }

    // Verificar si ya existe un registro de asistencia para esta sesión y usuario
    const registroExistente = await asistenciaRepository.findOne({
      where: { sesionId, usuarioId },
    });
    if (registroExistente) {
      return { error: "La asistencia para este estudiante ya ha sido registrada", statusCode: 400 };
    }

    // Crear un nuevo registro de asistencia
    const nuevoRegistroAsistencia = asistenciaRepository.create({
      tallerId,
      sesionId,
      usuarioId,
      estado: "presente",
      comentarios: "Asistencia registrada con token",
    });
    await asistenciaRepository.save(nuevoRegistroAsistencia);

    return { success: true, message: "Asistencia registrada correctamente" };
  } catch (error) {
    console.error("Error al registrar asistencia con token:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}
