"use strict";
import Taller from "../entity/taller.entity.js";
import { parse } from 'date-fns'; //
import {enviarCorreo} from '../helpers/nodemailer.helper.js';

import User from "../entity/user.entity.js"; // Importar la entidad de usuarios
import { AppDataSource } from "../config/configDb.js";

const convertirFecha = (fechaStr) => {
  return parse(fechaStr, 'dd/MM/yyyy', new Date());
};

// Obtener un taller por id o nombre
export async function getTallerService(id) { // obtener un taller por id
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    const tallerFound = await tallerRepository.findOne({
      where: { id: id },
      relations: ["profesor", "usuarios"], // Cargar también la relación con los usuarios
    });

    if (!tallerFound) return [null, "Taller no encontrado"];

    return [tallerFound, null];
  } catch (error) {
    console.error("Error al obtener el taller:", error);
    return [null, "Error interno del servidor"];
  }
}



export async function getTalleresService() { // Obtener todos los talleres
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    const talleres = await tallerRepository.find({
      relations: ["profesor", "usuarios"], // Cargar relación con profesor y usuarios
    });

    if (!talleres || talleres.length === 0) return [null, "No hay talleres"];

    return [talleres, null];
  } catch (error) {
    console.error("Error al obtener los talleres:", error);
    return [null, "Error interno del servidor"];
  }
}


// Crear un nuevo taller
export const createTallerService = async (tallerData) => {


  const { nombre, descripcion, fecha_inicio,fecha_fin, capacidad, profesorId,estado } = tallerData;
  const fechaInicioConvertida = convertirFecha(fecha_inicio);
  const fechaFinConvertida = convertirFecha(fecha_fin);

  const userRepository = AppDataSource.getRepository(User);
  const tallerRepository = AppDataSource.getRepository(Taller);

  // Verificamos si el usuario con el profesorId existe
  const profesor = await userRepository.findOne({ where: { id: profesorId } });

  if (!profesor) {
    throw new Error("El usuario no existe.");
  }

  // Verificamos si el usuario tiene el rol de "profesor"
  if (profesor.rol !== 'profesor') {
    throw new Error("El usuario no tiene el rol de profesor.");
  }
  

  // Si todo está bien, creamos el taller
  const nuevoTaller = tallerRepository.create({
    nombre,
    descripcion,
    fecha_inicio: fechaInicioConvertida,
    fecha_fin: fechaFinConvertida,
    capacidad,
    profesor, 
    inscritos: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    estado
  });

  const tallerGuardado = await tallerRepository.save(nuevoTaller);
  
  const estudiantes = await userRepository.find({
    where: { rol: "estudiante" }, // Cambia según tu lógica de relación entre talleres y estudiantes
    select: ['email'], // Solo necesitamos los correos electrónicos
  });
  const correosEstudiantes = estudiantes.map(estudiante => estudiante.email).join(','); // Unimos los correos en una cadena
  const asunto = `Nuevo Taller Creado: ${nombre}`;
  const texto = `Estimado(a) alumno(a),\nSe ha creado un nuevo taller: ${nombre}.\nDescripción: ${descripcion}\n \nProfesor : ${profesor.nombreCompleto}\nFecha de inicio: ${fechaInicioConvertida}\nFecha de fin: ${fechaFinConvertida}`;

  // Llamamos a la función para enviar el correo
  enviarCorreo(correosEstudiantes, asunto, texto);  
return tallerGuardado

  
  

};



// Actualizar un taller
export async function updateTallerService(id, body) {
  try {
     // ID del taller que se va a actualizar

    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User); // Repositorio de usuarios

    // Buscar el taller por su ID
    const tallerFound = await tallerRepository.findOneBy({ id });
    if (!tallerFound) return [null, "Taller no encontrado"];

    // Si se pasa profesorId en el body, buscar al profesor con ese ID
    if (body.profesorId) {
      const profesor = await userRepository.findOneBy({ id: body.profesorId, rol: 'profesor' });

      if (!profesor) return [null, "Profesor no encontrado o no tiene el rol adecuado"];
      
      // Asignar el profesor al taller
      tallerFound.profesor = profesor;
    }
    if (body.fecha_inicio) {
      tallerFound.fecha_inicio = convertirFecha(body.fecha_inicio);
    }
    if (body.fecha_fin) {
      tallerFound.fecha_fin = convertirFecha(body.fecha_fin);
    }
    

    // Actualizar otros campos del taller directamente
    tallerFound.nombre = body.nombre || tallerFound.nombre;
    tallerFound.descripcion = body.descripcion || tallerFound.descripcion;
   
    tallerFound.capacidad = body.capacidad || tallerFound.capacidad;
    tallerFound.estado = body.estado || tallerFound.estado;

    // Guardar el taller actualizado
    await tallerRepository.save(tallerFound);

    const estudiantes = await userRepository.find({
      where: { rol: "estudiante",talleres: tallerFound }, 
      select: ['email'], // Solo necesitamos los correos electrónicos de los alumnos inscritos
    });
    if (estudiantes.length > 0) {
      const correosEstudiantes = estudiantes.map(estudiante => estudiante.email).join(','); // Unimos los correos en una cadena
      const asunto = `Actualización Taller: ${tallerFound.nombre}`;
      const texto = `Estimado(a) alumno(a),\nSe ha actualizado información del taller: ${tallerFound.nombre}.`;
      enviarCorreo(correosEstudiantes, asunto, texto); 
    }
  
       
  
    return [tallerFound, null];
  } catch (error) {
    console.error("Error al actualizar el taller:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteStudentService(req) { // Eliminar alumno de un taller
  const { tallerId, alumnoId } = req.params;
  const userId = req.user.id;

  const tallerRepository = AppDataSource.getRepository(Taller);
  const userRepository = AppDataSource.getRepository(User);

  const taller = await tallerRepository.findOne({
    where: { id: tallerId },
    relations: ["usuarios", "profesor"],
  });
  
  if (!taller) throw { statusCode: 404, message: "Taller no encontrado" };

  const user = await userRepository.findOne({ where: { id: userId } }); // Buscar al usuario autenticado 
  if (user.rol !== "profesor" && user.rol !== "administrador") {
    throw { statusCode: 403, message: "Solo profesores o administradores pueden eliminar estudiantes" };
  }

  if (user.rol === "profesor" && taller.profesor.id !== userId) { // Verificar si el profesor es el asignado al taller
    throw { statusCode: 403, message: "Solo el profesor asignado puede eliminar estudiantes de este taller" };
  }

  const alumnoIndex = taller.usuarios.findIndex((u) => u.id === parseInt(alumnoId, 10)); // Buscar al alumno en el taller
  if (alumnoIndex === -1) throw { statusCode: 400, message: "El alumno no está inscrito en este taller" };

  taller.usuarios.splice(alumnoIndex, 1);
  taller.inscritos -= 1;
  await tallerRepository.save(taller);

  return taller;  // Devuelve el taller actualizado
}




// Eliminar un taller
export async function deleteTallerService(id) { // Eliminar un taller
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Buscar el taller por su ID
    const tallerFound = await tallerRepository.findOneBy({ id });
    if (!tallerFound) return [null, "Taller no encontrado"];

    // Eliminar el taller
    await tallerRepository.remove(tallerFound); // Eliminar el taller de la base de datos

    return [tallerFound, null]; // Retornar el taller eliminado (por si acaso)
  } catch (error) {
    console.error("Error al eliminar el taller:", error);
    return [null, "Error interno del servidor"];
  }
}





export const inscribirAlumnoAutenticadoService = async (userId, tallerId) => { // Inscribir a un alumno en un taller siendo un estudiante autenticado
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);

    // Buscar el taller
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"],
    });
    if (!taller) {
      return { success: false, statusCode: 404, message: "Taller no encontrado" };
    }

    
    const user = await userRepository.findOne({ where: { id: userId } }); // Verificar si el usuario es un estudiante
    if (user.rol !== "estudiante") {
      return { success: false, statusCode: 403, message: "Solo estudiantes pueden inscribirse en talleres" };
    }

   
    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === userId);  // Verificar si ya está inscrito
    if (isAlreadyEnrolled) {
      return { success: false, statusCode: 400, message: "Ya estás inscrito en este taller" };
    }

    // Verificar si hay cupos disponibles
    if (taller.usuarios.length >= taller.capacidad) {
      return { success: false, statusCode: 400, message: "No hay más cupos disponibles" };
    }

    // Inscribir al usuario
    taller.usuarios.push(user);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    // Enviar correo al profesor
    const mensajeProfesor = `Se inscribió al taller "${taller.nombre}" el alumno ${user.nombreCompleto}. La cantidad de inscritos es: ${taller.inscritos}.`;
    enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

    // Enviar correo al alumno
    const mensajeAlumno = `Te has inscrito con éxito al taller "${taller.nombre}".`;
    enviarCorreo(user.email, "Inscripción exitosa al taller", mensajeAlumno);

    return { success: true, taller, message: "Te has inscrito al taller con éxito y se han enviado los correos de confirmación" };
  } catch (error) {
    console.error("Error en inscribirAlumnoService:", error);
    return { success: false, statusCode: 500, message: "Error interno del servidor" };
  }
};



export const inscribirAlumnoService = async (tallerId, alumnoId, userId) => { // Inscribir a un alumno en un taller siendo un profesor o administrador
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);

    // Buscar el taller
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"],
    });
    if (!taller) return { error: 'Taller no encontrado', statusCode: 404 };

    
    const user = await userRepository.findOne({ where: { id: userId } }); //verificar si existe el usuario
    if (!user) return { error: 'Usuario no encontrado', statusCode: 404 };

    if (user.rol !== "profesor" && user.rol !== "administrador") { // Verificar si el usuario es profesor o administrador
      return { error: 'Solo profesores o administradores pueden inscribir a estudiantes', statusCode: 403 };
    }

    if (user.rol === "profesor" && taller.profesor.id !== userId) { // Verificar si el profesor es el asignado al taller
      return { error: 'Solo el profesor asignado puede inscribir estudiantes en este taller', statusCode: 403 };
    }

  
    const alumno = await userRepository.findOne({ where: { id: alumnoId } }); // Buscar al alumno por su ID
    if (!alumno) return { error: 'Alumno no encontrado', statusCode: 404 };

    if (alumno.rol !== "estudiante") { // Verificar si el usuario es un estudiante
      return { error: 'El usuario no tiene el rol de estudiante', statusCode: 400 };
    }

    // Verificar si el alumno ya está inscrito
    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === alumnoId);
    if (isAlreadyEnrolled) return { error: 'El alumno ya está inscrito en este taller', statusCode: 400 };

    if (taller.usuarios.length >= taller.capacidad) {
      return { error: 'No hay más cupos disponibles', statusCode: 400 };
    }

    // Inscribir al alumno
    taller.usuarios.push(alumno);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    const mensajeProfesor = `Se inscribió al taller "${taller.nombre}" el alumno ${alumno.nombreCompleto}. La cantidad de inscritos es: ${taller.inscritos}.`;
    enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

    const mensajeAlumno = `Te has inscrito con éxito al taller "${taller.nombre}".`;
    enviarCorreo(alumno.email, "Inscripción exitosa al taller", mensajeAlumno);

    return { success: true, taller };
  } catch (error) {
    console.error("Error en inscribirAlumnoService:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
};



export const obtenerTalleresInscritosService = async (userId) => { // Obtener los talleres inscritos por un estudiante
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al alumno por su ID
    const alumno = await userRepository.findOne({
      where: { id: userId },
      relations: ["talleres"],
    });

    if (!alumno) {
      return { error: 'Alumno no encontrado', statusCode: 404 };
    }

    // Verificar si el alumno está inscrito en algún taller
    const talleresInscritos = alumno.talleres;
    if (talleresInscritos.length === 0) {
      return { message: 'No estás inscrito en ningún taller', talleres: [] };
    }

    // Retornar los talleres en los que el alumno está inscrito
    return { success: true, talleres: talleresInscritos };
  } catch (error) {
    console.error("Error en obtenerTalleresInscritosService:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
};


export const obtenerTalleresInscritosProfesorService = async (profesorId) => {
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Obtener los talleres asignados al profesor
    const talleresAsignados = await tallerRepository.find({
      where: { profesor: { id: profesorId } }, // Buscar por el ID del profesor
      relations: ["usuarios"],
    });

    if (talleresAsignados.length === 0) { // Verificar si el profesor no tiene talleres asignados
      return { message: "No tienes talleres asignados", talleres: [] }; 
    }

    return { success: true, talleres: talleresAsignados };
  } catch (error) {
    console.error("Error en obtenerTalleresInscritosProfesorService:", error);
    return { error: "Error interno del servidor", statusCode: 500 };
  }
};
