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

// Obtener un taller por id o nombre
export async function getTallerController(req, res) {
  const [taller, error] = await getTallerService(req.params);
  if (error) return res.status(400).json({ message: error });
  res.json(taller);
}

// Obtener todos los talleres
export async function getTalleresController(req, res) {
  const [talleres, error] = await getTalleresService();
  if (error) return res.status(400).json({ message: error });
  res.json(talleres);
}

// Crear un nuevo taller
export async function createTallerController(req, res) {
  try {
    // Llamamos al servicio para crear el taller
    const { error } = tallerBodyValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const taller = await createTallerService(req.body);

    // Si todo va bien, devolvemos el taller creado
    return res.status(201).json(taller);
  } catch (error) {
    // En caso de error, devolvemos una respuesta con el código de estado 400 o 500 según corresponda
    console.error("Error al crear el taller:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}



// Actualizar un taller
export async function updateTallerController(req, res) {
  // Validar el cuerpo del request usando el esquema para PATCH
  const { error, value } = tallerPatchValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Si pasa la validación, pasamos los datos al servicio
  const [taller, serviceError] = await updateTallerService(req.params, value);
  if (serviceError) return res.status(400).json({ message: serviceError });
  
  res.json(taller);
}

export const deleteStudentController = async (req, res) => {
  try {
    await deleteStudentService(req, res);
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Eliminar un taller
export async function deleteTallerController(req, res) {
  const { id } = req.params; // Obtenemos el ID de los params de la URL

  // Llamamos al servicio con el ID
  const [taller, error] = await deleteTallerService(id);

  if (error) return res.status(400).json({ message: error });
  return res.json({ message: "Taller eliminado correctamente", taller });
}


// Inscribir a un alumno en un taller

export const inscribirAlumno = async (req, res) => { // VALIDATION

  try {
    await inscribirAlumnoAutenticado(req, res);
    
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Controlador para profesores y administradores
export const inscribirAlumnoPorProfesorOAdmin = async (req, res) => {  /// VALIDATION

  try {
    // Solo llama al servicio, ya que este se encarga de manejar las respuestas
    await inscribirAlumnoService(req, res);
  } catch (error) {
    // Maneja cualquier error inesperado aquí
    console.error('Error al inscribir alumno:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const TalleresInscritos = async (req, res) => {
  try {
    await obtenerTalleresInscritos(req, res);
    
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const TalleresInscritosProfesor = async (req, res) => {
  try {
    await obtenerTalleresInscritosProfesor(req, res);
    
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    return res.status(500).json({ message: 'Error interno del servidor 2' });
  }
};
