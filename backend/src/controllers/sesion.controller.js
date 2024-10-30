"use strict";
import Sesion from "../entity/sesion.entity.js";
import Taller from "../entity/taller.entity.js";
import Inscripcion from "../entity/inscripcion.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

// Función para crear una sesión en un taller
export async function crearSesion(req, res) {
  try {
    const taller_id = parseInt(req.params.taller_id, 10); // Asegúrate de que `taller_id` es un entero
    console.log("Taller ID recibido:", taller_id); // Para verificar que el ID se está pasando correctamente
    const { fecha, estado } = req.body;

    // Validación del `taller_id`
    if (isNaN(taller_id) || taller_id <= 0) {
      return handleErrorClient(res, 400, "ID de taller no válido");
    }

    // Verificar que el usuario sea un profesor
    if (req.user.rol !== "profesor") {
      return handleErrorClient(res, 403, "No tienes permisos para crear una sesión");
    }

    // Verificar que el taller existe
    const tallerRepository = AppDataSource.getRepository(Taller);
    const taller = await tallerRepository.findOne({ where: { id: taller_id } });

    if (!taller) {
      return handleErrorClient(res, 404, "Taller no encontrado");
    }

    // Crear una nueva sesión asociada al taller correcto
    const sesionRepository = AppDataSource.getRepository(Sesion);
    const nuevaSesion = sesionRepository.create({
      fecha,
      estado,
      taller, // Asignar el objeto completo de `taller`
    });

    await sesionRepository.save(nuevaSesion);

    // Devolver una respuesta de éxito
    handleSuccess(res, 201, "Sesión creada con éxito", nuevaSesion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Función para obtener la lista de estudiantes inscritos en una sesión específica
export async function obtenerEstudiantesInscritos(req, res) {
  try {
    const sesion_id = parseInt(req.params.sesion_id, 10);

    // Validación del `sesion_id`
    if (isNaN(sesion_id) || sesion_id <= 0) {
      return handleErrorClient(res, 400, "ID de sesión no válido");
    }

    // Verificar que el usuario sea un profesor
    if (req.user.rol !== "profesor") {
      return handleErrorClient(res, 403, "No tienes permisos para ver la lista de estudiantes inscritos.");
    }

    const sesionRepository = AppDataSource.getRepository(Sesion);
    const inscripcionRepository = AppDataSource.getRepository(Inscripcion);

    // Verificar que la sesión existe y obtener el `taller_id`
    const sesion = await sesionRepository.findOne({ where: { id: sesion_id }, relations: ["taller"] });
    if (!sesion) {
      return handleErrorClient(res, 404, "La sesión no existe.");
    }

    // Buscar todas las inscripciones en el taller asociado a la sesión
    const inscripciones = await inscripcionRepository.find({
      where: { taller_id: sesion.taller.id },
      relations: ["estudiante"],
    });

    // Verificar si existen inscripciones en el taller para esta sesión
    if (!inscripciones.length) {
      return handleErrorClient(res, 404, "No hay estudiantes inscritos en este taller.");
    }

    // Formatear la lista de estudiantes para la respuesta
    const listaEstudiantes = inscripciones.map((inscripcion) => ({
      estudiante_id: inscripcion.estudiante.id,
      nombreCompleto: inscripcion.estudiante.nombreCompleto,
      email: inscripcion.estudiante.email,
    }));

    // Devolver una respuesta de éxito con la lista de estudiantes inscritos
    handleSuccess(res, 200, "Lista de estudiantes inscritos obtenida exitosamente.", listaEstudiantes);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
