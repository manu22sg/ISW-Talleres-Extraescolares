"use strict";
import {
  createTallerService,
  deleteStudentService,
  deleteTallerService,
  getTalleresService,
  getTallerService,
  inscribirAlumnoAutenticadoService,
  inscribirAlumnoService,
  obtenerTalleresInscritosProfesor1Service,
  obtenerTalleresInscritosProfesorService,
  obtenerTalleresInscritosService,
  updateTallerService,validarRutProfesorService, validarRutEstudianteService
} from "../services/taller.service.js";
import { tallerBodyValidation,tallerPatchValidation } from "../validations/taller.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


// Obtener un taller por id o nombre
export async function getTallerController(req, res) { // Obtener un taller por id
  try {
    const { id } = req.params;
    const { user } = req; // Extraer el usuario autenticado desde la solicitud
    const [taller, error] = await getTallerService(id, user);

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    return handleSuccess(res, 200, "Taller encontrado", taller);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}




export async function getTalleresController(req, res) { // Obtener todos los talleres
  try {
    const { user } = req; // Extraer el usuario autenticado desde la solicitud
    const [talleres, error] = await getTalleresService(user); // Pasar el usuario al servicio

    if (error) {
      return handleErrorClient(res, 400, error);
    }

    return handleSuccess(res, 200, "Talleres encontrados", talleres); // Si no hay errores, devolver respuesta de éxito

  } catch (err) {
    console.error("Error al obtener los talleres:", err);
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

    const result = await createTallerService(req.body);

    if (result.error) {
      return handleErrorClient(res, result.statusCode, result.message);
    }

    return handleSuccess(res, 201, "Taller creado exitosamente", result);
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}





// Actualizar un taller
export async function updateTallerController(req, res) { // Actualizar un taller por su id
 try {
  
  const { error, value } = tallerPatchValidation.validate(req.body); // Validación de los datos del taller

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



export const deleteStudentController = async (req, res) => { // Eliminar alumno de un taller
  try {
   
    const taller = await deleteStudentService(req); // Llamada al servicio para eliminar el alumno del taller
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




export async function deleteTallerController(req, res) { // Eliminar un taller
try {
  const { id } = req.params; // ID del taller a eliminar obtenido de la URL
  const [taller, error] = await deleteTallerService(id); // Llamada al servicio

  if (error) {
    return handleErrorClient(res, 400, error);
  }

  return handleSuccess(res, 200, "Taller eliminado correctamente", taller);
} catch (error) {
  return handleErrorServer(res, 500, "Error al procesar la solicitud");
}
}



// Inscribir a un alumno en un taller siendo el alumno autenticado

export const inscribirAlumnoAutenticadoController = async (req, res) => {
  try {
    const { tallerId } = req.body; // ID del taller a inscribir en el cuerpo de la solicitud
     // ID del alumno autenticado en el token
const userId = req.user.id;
    

    const { success, statusCode, message, taller } = await inscribirAlumnoAutenticadoService(userId,tallerId);

    if (!success) {
      if (statusCode >= 400 && statusCode < 500) {
        return handleErrorClient(res, statusCode, message);
      }
      return handleErrorServer(res, statusCode, message);
    }

    // Respuesta exitosa
    return handleSuccess(res, 200, { taller, message});
  } catch (error) {
    console.error("Error al inscribir alumno:", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
};



// Controlador para profesores y administradores
export const inscribirAlumnoPorProfesorOAdminController = async (req, res) => {
  const { tallerId, alumnoId } = req.body;
   // ID del profesor o administrador

  // Llamada al servicio de inscripción de alumnos
  const { success, error, statusCode, taller, message } = await inscribirAlumnoService(tallerId, alumnoId);

  // Manejo de errores
  if (!success) {
    if (statusCode >= 400 && statusCode < 500) {
      return handleErrorClient(res, statusCode, error);
    }
    return handleErrorServer(res, statusCode, error);
  }

  // Respuesta exitosa con el mensaje adecuado
  return handleSuccess(res, 200, { taller, message });
};





export const talleresInscritosController = async (req, res) => {
  const userId = req.user.id; // ID del alumno

  const { success, error, statusCode, talleres } = await obtenerTalleresInscritosService(userId);

  if (!success) {
    
    if (statusCode >= 400 && statusCode < 500) { // Si es un error de cliente 4xx, usar handleErrorClient
      return handleErrorClient(res, statusCode, error);
    }
   
    return handleErrorServer(res, statusCode, error); // Si es un error de servidor 5xx, usar handleErrorServer
  }

 
  return handleSuccess(res, 200, { talleres, message: "Talleres correspondientes" });  // Respuesta exitosa

};


export const talleresInscritosProfesorController = async (req, res) => {
  const profesorId = req.user.id; // ID del profesor obtenido del token

  const { success, error, statusCode, talleres } = await obtenerTalleresInscritosProfesorService(profesorId);
   // Llamada al servicio

  if (!success) {
    // Si es un error de cliente (4xx), usar handleErrorClient
    if (statusCode >= 400 && statusCode < 500) {
      return handleErrorClient(res, statusCode, error);
    }
    // Si es un error de servidor (5xx), usar handleErrorServer
    return handleErrorServer(res, statusCode, error);
  }

  // Respuesta exitosa
  return handleSuccess(res, 200, { talleres, message: "Talleres correspondientes" });

};

export const talleresInscritosProfesor1Controller = async (req, res) => {
  const profesorId = req.user.id; // ID del profesor obtenido del token
  const { tallerId } = req.body; // ID del taller a inscribir en el cuerpo de la solicitud

  const{ success, error, statusCode=500, taller } = await obtenerTalleresInscritosProfesor1Service(profesorId,tallerId);

  if (!success) {
    // Si es un error de cliente (4xx), usar handleErrorClient
    if (statusCode >= 400 && statusCode < 500) {
      return handleErrorClient(res, statusCode, error);
    }
    // Si es un error de servidor (5xx), usar handleErrorServer
    return handleErrorServer(res, statusCode, error);
  }

  // Respuesta exitosa
  return handleSuccess(res, 200, "Taller correspondiente encontrado", taller);
};


export async function validarRutProfesorController(req, res) {
  try {
    const { rut } = req.body; // Cambiar a req.body si usas POST

    if (!rut) {
      return handleErrorClient(res, 400, "El RUT es requerido.");
    }

    const [profesorId, error] = await validarRutProfesorService(rut);

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(res, 200, "Profesor encontrado", { profesorId });
  } catch (error) {
    console.error("Error al validar el RUT del profesor:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al validar el RUT.");
  }
}

export async function validarRutEstudianteController(req, res) {
  try {
    const { rut } = req.body; // Cambiar a req.body si usas POST

    if (!rut) {
      return handleErrorClient(res, 400, "El RUT es requerido.");
    }

    const [estudianteId, error] = await validarRutEstudianteService(rut);

    if (error) {
      return handleErrorClient(res, 404, error);
    }

    return handleSuccess(res, 200, "Estudiante encontrado", { estudianteId });
  } catch (error) {
    console.error("Error al validar el RUT del estudiante:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al validar el RUT.");
  }
}





