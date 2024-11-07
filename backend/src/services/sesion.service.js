// src/services/sesion.service.js
"use strict";
import Sesion from "../entity/sesion.entity.js";
import Taller from "../entity/taller.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { addMinutes } from "date-fns"; // Importar para manejar la fecha de expiración

// Servicio para crear una nueva sesión en un taller
export async function crearSesionService(tallerId, fecha, estado = "pendiente", idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Validar si el taller existe y obtener el profesor asociado
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["profesor"],
    });

    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor que intenta crear la sesión es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para crear una sesión en este taller", statusCode: 403 };
    }

    // Generar un token de asistencia de 4 dígitos
    const tokenAsistencia = Math.floor(1000 + Math.random() * 9000); // Genera un número aleatorio de 4 dígitos

    // Calcular la fecha de expiración del token (1 hora y 30 minutos después de la fecha de creación)
    const expiracionToken = addMinutes(new Date(), 90);

    // Crear la nueva sesión
    const nuevaSesion = sesionRepository.create({
      taller: { id: tallerId },
      fecha,
      estado,
      tokenAsistencia,
      expiracionToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar la sesión en la base de datos
    const sesionGuardada = await sesionRepository.save(nuevaSesion);

    return { success: true, sesion: sesionGuardada };
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}

// Servicio para actualizar una sesión con validaciones adicionales
export async function actualizarSesionService(sesionId, camposActualizados, idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Buscar la sesión por su ID
    const sesion = await sesionRepository.findOne({ where: { id: sesionId }, relations: ["taller"] });
    if (!sesion) {
      return { error: "Sesión no encontrada", statusCode: 404 };
    }

    // Verificar si el taller existe
    const taller = await tallerRepository.findOne({ where: { id: sesion.taller.id },
      relations: ["profesor"]  });
    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para actualizar esta sesión", statusCode: 403 };
    }

    // Actualizar los campos proporcionados
    if (camposActualizados.fecha) {
      sesion.fecha = camposActualizados.fecha;
    }
    if (camposActualizados.estado) {
      sesion.estado = camposActualizados.estado;
    }

    // Guardar los cambios en la base de datos
    const sesionActualizada = await sesionRepository.save(sesion);

    return { success: true, sesion: sesionActualizada };
  } catch (error) {
    console.error("Error al actualizar la sesión:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}

// Servicio para obtener las sesiones de un taller con validaciones adicionales
export async function obtenerSesionesPorTallerService(tallerId, idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Verificar si el taller existe
    const taller = await tallerRepository.findOne({ where: { id: tallerId },
      relations: ["profesor"] });
    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para ver las sesiones de este taller", statusCode: 403 };
    }

    // Buscar todas las sesiones asociadas al taller
    const sesiones = await sesionRepository.find({ where: { taller: { id: tallerId } } });

    if (sesiones.length === 0) {
      return { message: "No hay sesiones disponibles para este taller", sesiones: [] };
    }

    return { success: true, sesiones };
  } catch (error) {
    console.error("Error al obtener las sesiones del taller:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}


// Servicio para eliminar una sesión con validaciones adicionales
export async function eliminarSesionService(sesionId, idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Buscar la sesión por su ID
    const sesion = await sesionRepository.findOne({ where: { id: sesionId }, relations: ["taller"] });
    if (!sesion) {
      return { error: "Sesión no encontrada", statusCode: 404 };
    }

    // Verificar si el taller existe y obtener el profesor asociado
    const taller = await tallerRepository.findOne({
      where: { id: sesion.taller.id },
      relations: ["profesor"]
    });
    if (!taller) {
      return { error: "Taller no encontrado", statusCode: 404 };
    }

    // Verificar si el profesor es el profesor asignado al taller
    if (taller.profesor.id !== idProfesor) {
      return { error: "No está autorizado para eliminar esta sesión", statusCode: 403 };
    }

    // Eliminar la sesión de la base de datos
    await sesionRepository.remove(sesion);

    return { success: true, message: "Sesión eliminada exitosamente" };
  } catch (error) {
    console.error("Error al eliminar la sesión:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}
