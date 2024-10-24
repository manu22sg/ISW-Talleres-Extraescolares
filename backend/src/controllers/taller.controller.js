"use strict";
import {
  getTallerService,
  getTalleresService,
  createTallerService,
  updateTallerService,
  deleteTallerService,
  inscribirAlumnoAutenticado,
  inscribirAlumnoService,
  
  obtenerTalleresInscritos,
  deleteStudentService,
  obtenerTalleresInscritosProfesor
} from "../services/taller.service.js";
import { tallerBodyValidation,tallerPatchValidation } from "../validations/taller.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";


// Obtener un taller por id o nombre
export async function getTallerController(req, res) {
 try {
  const { id } = req.params;
  const [taller, error] = await getTallerService(id);

  if (error) {
    return handleErrorClient(res, 400, error);
  }

  return handleSuccess(res, 200, "Taller encontrado", taller);
 } catch (error) {
  return handleErrorServer(res, 500, "Error al procesar la solicitud");

 }
}


// Obtener todos los talleres
export async function getTalleresController(req, res) {
  try {
    // Llamada al servicio
    const [talleres, error] = await getTalleresService();

    // Si hay error desde el servicio, manejar con handleErrorClient
    if (error) {
      return handleErrorClient(res, 400, error);
    }

    // Si no hay errores, devolver respuesta de éxito
    return handleSuccess(res, 200, "Talleres encontrados", talleres);

  } catch (err) {
    // Captura cualquier error inesperado y lo maneja con handleErrorClient
    return handleErrorServer(res, 500, "Error al obtener los talleres");
  }
}


// Crear un nuevo taller
export async function createTallerController(req, res) {
  try {
    const { error } = tallerBodyValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const taller = await createTallerService(req.body);
    return handleSuccess(res, 201, "Taller creado exitosamente", taller);
  } catch (error) {
    console.error("Error al crear el taller:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}




// Actualizar un taller
export async function updateTallerController(req, res) {
 try {
  const { error, value } = tallerPatchValidation.validate(req.body);

  if (error) {
    return handleErrorClient(res, 400, error.details[0].message);
  }

  const { id } = req.params;
  const [taller, serviceError] = await updateTallerService(id, value);

  if (serviceError) {
    return handleErrorClient(res, 400, serviceError);
  }

  return handleSuccess(res, 200, "Taller actualizado exitosamente", taller);
 } catch (error) {
  return handleErrorServer(res, 500, "Error al procesar la solicitud");
 }
}



export const deleteStudentController = async (req, res) => {
  try {
    const taller = await deleteStudentService(req);
    return handleSuccess(res, 200, "Alumno eliminado correctamente del taller", { taller });
  } catch (error) {
    const { statusCode = 500, message = "Error interno del servidor" } = error;
    
    // Manejo de errores de cliente
    if (statusCode < 500) {
      return handleErrorClient(res, statusCode, message);
    }
    // Manejo de errores de servidor
    return handleErrorServer(res, statusCode, message);
  }
};



// Eliminar un taller
export async function deleteTallerController(req, res) {
try {
  const { id } = req.params;
  const [taller, error] = await deleteTallerService(id);

  if (error) {
    return handleErrorClient(res, 400, error);
  }

  return handleSuccess(res, 200, "Taller eliminado correctamente", taller);
} catch (error) {
  return handleErrorServer(res, 500, "Error al procesar la solicitud");
}
}



// Inscribir a un alumno en un taller

export const inscribirAlumno = async (req, res) => {
  try {
    await inscribirAlumnoAutenticado(req, res);
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    return handleErrorServer(res, 500, 'Error interno del servidor');
  }
};


// Controlador para profesores y administradores
export const inscribirAlumnoPorProfesorOAdmin = async (req, res) => {
  try {
    await inscribirAlumnoService(req, res);
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    return handleErrorServer(res, 500, 'Error interno del servidor');
  }
};


export const TalleresInscritos = async (req, res) => {
  try {
    await obtenerTalleresInscritos(req, res);
  } catch (error) {
    console.error('Error al obtener talleres inscritos:', error);
    return handleErrorServer(res, 500, 'Error interno del servidor');
  }
};


export const TalleresInscritosProfesor = async (req, res) => {
  try {
    await obtenerTalleresInscritosProfesor(req, res);
  } catch (error) {
    console.error('Error al obtener talleres inscritos por profesor:', error);
    return handleErrorServer(res, 500, 'Error interno del servidor');
  }
};
