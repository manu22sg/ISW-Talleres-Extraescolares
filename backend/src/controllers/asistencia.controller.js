"use strict";
import { obtenerInscritosSesionService, registrarAsistenciaService } from "../services/asistencia.service.js";
import { actualizarEstadoAsistenciaService } from "../services/asistencia.service.js";
import { registrarAsistenciaConTokenService } from "../services/asistencia.service.js";
import { obtenermisSesionService } from "../services/asistencia.service.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";


// Controlador para obtener la lista de estudiantes inscritos en una sesión específica
export async function obtenerInscritosSesion(req, res) {
  const { tallerId, sesionId } = req.params;

  console.log("Recibiendo solicitud para obtener inscritos en sesión.");
  console.log("Parámetros recibidos:", { tallerId, sesionId });

  

  const idProfesor = req.user.id; // Obtener el ID del profesor desde el token
  console.log("ID del profesor autenticado:", idProfesor);

  try {
    const result = await obtenerInscritosSesionService(tallerId, sesionId, idProfesor);

    if (!result || result.error) {
      console.error("Error al obtener inscritos del servicio:", result.error);
      return res.status(result.statusCode || 500).json({ error: result.error || "Error desconocido" });
    }

    console.log("Lista de inscritos obtenida exitosamente:", result);
    res.json(result);
  } catch (error) {
    console.error("Error interno del servidor al obtener inscritos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function vermiAsistencia(req, res) {
  const correo = req.user.email;
  const userRepository = AppDataSource.getRepository(User);
  const usuario = await userRepository.findOne({ where: { email: correo } });
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  try {
    const result = await obtenermisSesionService(usuario.id);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.error });
    }
    res.json(result);
    
  } catch (error) {
    console.error("Error al obtener inscritos del taller:", error);
    res.status(500).json({ error: "Error interno del servidor" });

  }
}




// Controlador para registrar o actualizar la asistencia en una sesión
export async function registrarAsistencia(req, res) {

  const { tallerId, sesionId } = req.params;
  const { asistencias } = req.body; // Array de { usuarioId, estado, comentarios }
  const idProfesor = req.user.id; // Obteniendo el ID del profesor desde el token
  const result = await registrarAsistenciaService(tallerId, sesionId, asistencias, idProfesor);
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}

// Controlador para actualizar el estado de la asistencia de un estudiante
export async function actualizarEstadoAsistencia(req, res) {
  const { tallerId, sesionId, usuarioId } = req.params;
  const { nuevoEstado, comentarios } = req.body;
  console.log("Recibiendo solicitud para actualizar estado de asistencia.");

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Usuario no autorizado" });
  }

  const idProfesor = req.user.id; // Obtener el ID del profesor desde el token JWT

  try {
    const result = await actualizarEstadoAsistenciaService(
      tallerId,
      sesionId,
      usuarioId,
      nuevoEstado,
      comentarios,
      idProfesor
    );

    if (result.error) {
      return res.status(result.statusCode).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Error al actualizar el estado de asistencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


// Controlador para que los estudiantes registren asistencia usando el token
export async function registrarAsistenciaConToken(req, res) {
  const { tallerId, sesionId } = req.params;
  const { usuarioRut, tokenAsistencia } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const persona = await userRepository.findOne({ where: { rut: usuarioRut } });
  const usuarioId = persona.id; 
  
  try {
    const result = await registrarAsistenciaConTokenService(tallerId, sesionId, usuarioId, tokenAsistencia);
    if (result.error) {
      return res.status(result.statusCode).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    console.error("Error al registrar asistencia con token:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

