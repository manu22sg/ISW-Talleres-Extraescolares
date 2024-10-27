"use strict";
import Taller from "../entity/taller.entity.js";
import { parse } from 'date-fns'; //
import {enviarCorreo} from '../helpers/nodemailer.helper.js';

import User from "../entity/user.entity.js"; // Importar la entidad de usuarios
import { AppDataSource } from "../config/configDb.js";

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


// Obtener todos los talleres
export async function getTalleresService() { // obtener todos los talleres
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
const convertirFecha = (fechaStr) => {
  return parse(fechaStr, 'dd/MM/yyyy', new Date());
};

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
      where: { rol: "estudiante",talleres: tallerFound }, // Cambia según tu lógica de relación entre talleres y estudiantes
      select: ['email'], // Solo necesitamos los correos electrónicos
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

export async function deleteStudentService(req) {
  const { tallerId, alumnoId } = req.params;
  const userId = req.user.id;

  const tallerRepository = AppDataSource.getRepository(Taller);
  const userRepository = AppDataSource.getRepository(User);

  const taller = await tallerRepository.findOne({
    where: { id: tallerId },
    relations: ["usuarios", "profesor"],
  });
  
  if (!taller) throw { statusCode: 404, message: "Taller no encontrado" };

  const user = await userRepository.findOne({ where: { id: userId } });
  if (user.rol !== "profesor" && user.rol !== "administrador") {
    throw { statusCode: 403, message: "Solo profesores o administradores pueden eliminar estudiantes" };
  }

  if (user.rol === "profesor" && taller.profesor.id !== userId) {
    throw { statusCode: 403, message: "Solo el profesor asignado puede eliminar estudiantes de este taller" };
  }

  const alumnoIndex = taller.usuarios.findIndex((u) => u.id === parseInt(alumnoId, 10));
  if (alumnoIndex === -1) throw { statusCode: 400, message: "El alumno no está inscrito en este taller" };

  taller.usuarios.splice(alumnoIndex, 1);
  taller.inscritos -= 1;
  await tallerRepository.save(taller);

  return taller;  // Devuelve el taller actualizado
}




// Eliminar un taller
export async function deleteTallerService(id) {
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Buscar el taller por su ID
    const tallerFound = await tallerRepository.findOneBy({ id });
    if (!tallerFound) return [null, "Taller no encontrado"];

    // Eliminar el taller
    await tallerRepository.remove(tallerFound);

    return [tallerFound, null]; // Retornar el taller eliminado (por si se necesita)
  } catch (error) {
    console.error("Error al eliminar el taller:", error);
    return [null, "Error interno del servidor"];
  }
}


// Inscribir a un alumno en un taller siendo un estudiante autenticado


export async function inscribirAlumnoAutenticado(req, res) {
  try {
    const { tallerId } = req.body;
    const userId = req.user.id;  // Extraer el userId del token JWT

    const tallerRepository = AppDataSource.getRepository(Taller); // Repositorio de talleres
    const userRepository = AppDataSource.getRepository(User); // Repositorio de usuarios

    // Buscar el taller
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"], // Agregamos "profesor" para acceder al email del profesor
    });
    if (!taller) return res.status(404).json({ message: "Taller no encontrado" });

    // Verificar si el usuario es un estudiante
    const user = await userRepository.findOne({ where: { id: userId } });
    if (user.rol !== "estudiante") {
      return res.status(403).json({ message: "Solo estudiantes pueden inscribirse en talleres" });
    }

    // Verificar si ya está inscrito
    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === userId);
    if (isAlreadyEnrolled) return res.status(400).json({ message: "Ya estás inscrito en este taller" });

    // Verificar si hay cupos disponibles
    if (taller.usuarios.length >= taller.capacidad) {
      return res.status(400).json({ message: "No hay más cupos disponibles" });
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

    return res.status(200).json({ taller, message: "Te has inscrito al taller con éxito y se han enviado los correos de confirmación" });
  } catch (error) {
    console.error("Error al inscribir al alumno:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function inscribirAlumnoService(req, res) {
  try {
    const { tallerId, alumnoId } = req.body;
    const userId = req.user.id;  // ID del profesor o administrador que está haciendo la inscripción

    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);

    // Buscar el taller
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"],  // Incluyendo el profesor relacionado
    });
    if (!taller) return res.status(404).json({ message: "Taller no encontrado" });

    // Verificar si el usuario es un profesor del taller o administrador
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.rol !== "profesor" && user.rol !== "administrador") {
      return res.status(403).json({ message: "Solo profesores o administradores pueden inscribir a estudiantes" });
    }

    // Si es profesor, verificar que sea el profesor asignado al taller
    if (user.rol === "profesor" && taller.profesor.id !== userId) {
      return res.status(403).json({ message: "Solo el profesor asignado puede inscribir estudiantes en este taller" });
    }

    // Verificar si el alumno existe
    const alumno = await userRepository.findOne({ where: { id: alumnoId } });
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    // Verificar si el usuario tiene el rol de estudiante
    if (alumno.rol !== "estudiante") {
      return res.status(400).json({ message: "El usuario no tiene el rol de estudiante" });
    }

    // Verificar si el alumno ya está inscrito
    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === alumnoId);
    if (isAlreadyEnrolled) return res.status(400).json({ message: "El alumno ya está inscrito en este taller" });

    // Verificar si hay cupos disponibles
    if (taller.usuarios.length >= taller.capacidad) {
      return res.status(400).json({ message: "No hay más cupos disponibles" });
    }

    // Inscribir al alumno
    taller.usuarios.push(alumno);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    return res.status(200).json({ taller, message: "Alumno inscrito correctamente" });
  } catch (error) {
    console.error("Error al inscribir al alumno:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}













export async function obtenerTalleresInscritos(req, res) {
  try {
    const userId = req.user.id; // Obtener el ID del alumno de los parámetros de la ruta

    const userRepository = AppDataSource.getRepository(User);  // Repositorio de usuarios

    // Buscar al alumno por su ID
    const alumno = await userRepository.findOne({
      where: { id: userId },
      relations: ["talleres"],  // Incluir los talleres en los que está inscrito
    });
    
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Verificar si el alumno está inscrito en algún taller
    const talleresInscritos = alumno.talleres;
    if (talleresInscritos.length === 0) {
      return res.status(200).json({ message: "no estas inscrito en ningún taller" });
    }

    // Devolver los talleres en los que el alumno está inscrito
    return res.status(200).json({ talleres: talleresInscritos });
  } catch (error) {
    console.error("Error al obtener los talleres inscritos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


export async function obtenerTalleresInscritosProfesor(req, res) {
  try {
    const profesorId = req.user.id; // El ID del profesor viene desde el JWT
    
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Obtener los talleres en los que el profesor está inscrito
    const talleresAsignados = await tallerRepository.find({
      where: { profesor: { id: profesorId } }, // Busca por el ID del profesor en la relación
      relations: ["usuarios"], // Incluir los usuarios inscritos en cada taller
    });
    

    // Para depurar

    if (talleresAsignados.length === 0) {
      return res.status(200).json({ message: "No tienes talleres asignados" });
    }

    // Devolver los talleres en los que el profesor está asignado
    return res.status(200).json({ talleres: talleresAsignados });
  } catch (error) {
    console.error("Error al obtener los talleres del profesor:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}