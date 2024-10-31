// src/services/sesion.service.js
"use strict";
import Sesion from "../entity/sesion.entity.js";
import Taller from "../entity/taller.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Servicio para crear una nueva sesión en un taller
export async function crearSesionService(tallerId, fecha, estado = "pendiente", idProfesor) {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Verificar si el taller existe y está asignado al profesor
    const taller = await tallerRepository.findOne({
      where: { id: tallerId, profesor: { id: idProfesor } }, // Verificar el ID del taller y del profesor
      relations: ["usuarios"],
    });

    // Si no se encuentra el taller o el profesor no está asignado
    if (!taller) {
      return { error: "No está autorizado para crear una sesión en este taller o el taller no existe",
         statusCode: 403 };
    }

    // Crear la nueva sesión
    const nuevaSesion = sesionRepository.create({
      taller: { id: tallerId },
      fecha,
      estado,
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
