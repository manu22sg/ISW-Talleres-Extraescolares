"use strict";
import { crearSesionService } from "../services/sesion.service.js";
import { actualizarSesionService } from "../services/sesion.service.js";
import { obtenerSesionesPorTallerService } from "../services/sesion.service.js";
import { eliminarSesionService } from "../services/sesion.service.js";

// Controlador para crear una nueva sesión en un taller
export async function crearSesion(req, res) {
  const { tallerId } = req.params;
  const { fecha, estado } = req.body;
  const idProfesor = req.user.id; // ID del profesor autenticado

  console.log(`Solicitud de creación de sesión: Taller ID = ${tallerId}, Profesor ID = ${idProfesor}`);
  
  try {
    const result = await crearSesionService(tallerId, fecha, estado, idProfesor);
    
    // Manejo de errores específicos
    if (result.error) {
      console.error("Error al crear sesión:", result.error);
      return res.status(result.statusCode || 500).json({ error: result.error });
    }

    // Éxito
    return res.status(201).json({ success: true, sesion: result.sesion });
  } catch (error) {
    console.error("Error inesperado al crear sesión:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Controlador para actualizar una sesión
export async function actualizarSesion(req, res) {
  const { sesionId } = req.params; // Obtener el ID de la sesión desde los parámetros
  const { fecha, estado } = req.body; // Obtener los campos a actualizar desde el cuerpo de la solicitud
  const idProfesor = req.user.id; // Obtener el ID del profesor desde req.user

  const result = await actualizarSesionService(sesionId, { fecha, estado }, idProfesor);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}

// Controlador para obtener las sesiones de un taller
export async function obtenerSesionesPorTaller(req, res) {
  const { tallerId } = req.params; // Obtener el ID del taller desde los parámetros
  const idProfesor = req.user.id; // Obtener el ID del profesor desde req.user

  const result = await obtenerSesionesPorTallerService(tallerId, idProfesor);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}


export async function eliminarSesion(req, res) {
  const { sesionId } = req.params;
  const idProfesor = req.user.id; // Asume que `idProfesor` se obtiene del token JWT

  const result = await eliminarSesionService(sesionId, idProfesor);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}
