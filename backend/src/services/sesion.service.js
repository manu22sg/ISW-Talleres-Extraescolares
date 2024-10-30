// src/services/sesion.service.js
"use strict";
import Sesion from "../entity/sesion.entity.js";
import { AppDataSource } from "../config/configDb.js";

// Servicio para crear una nueva sesión en un taller
export async function crearSesionService(tallerId, fecha, estado = "pendiente") {
  try {
    const sesionRepository = AppDataSource.getRepository(Sesion);

    // Crear una nueva sesión
    const nuevaSesion = sesionRepository.create({
      taller: { id: tallerId },
      fecha,
      estado,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Guardar la sesión en la base de datos
    const sesionGuardada = await sesionRepository.save(nuevaSesion);

    return { success: true, sesion: sesionGuardada };
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
}
