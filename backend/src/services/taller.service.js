"use strict";
import Taller from "../entity/taller.entity.js";
import ListaDeEspera from "../entity/listaDeEspera.entity.js";
import { parse } from "date-fns"; //
import { enviarCorreo } from "../helpers/nodemailer.helper.js";
import { Not } from "typeorm";

import User from "../entity/user.entity.js"; // Importar la entidad de usuarios
import { AppDataSource } from "../config/configDb.js";
import { anadirAutomaticoUser } from "../controllers/listaDeEspera.controller.js";

const convertirFecha = (fechaStr) => {
  return parse(fechaStr, "dd/MM/yyyy", new Date());
};



// Obtener un taller por id o nombre
export async function getTallerService(id, user) { // obtener un taller por id
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    let condicion = { id: id }; // Condición de búsqueda por ID del taller

    // Si el usuario no es administrador, excluir los talleres eliminados
    if (user.rol !== "administrador") { // si el usuario no es administrador excluye los talleres eliminados
      condicion.estado = Not("eliminado"); // Excluir los talleres con estado 'eliminado'
    }

    // Buscar el taller según la condición establecida
    const tallerFound = await tallerRepository.findOne({
      where: condicion, // Condición de búsqueda por ID y estado
      relations: ["profesor", "usuarios"], // Cargar también la relación con los usuarios
    });

    if (!tallerFound) return [null, "Taller no encontrado"];

    return [tallerFound, null];
  } catch (error) {
    console.error("Error al obtener el taller:", error);
    return [null, "Error interno del servidor"];
  }
}



export async function getTalleresService(user) { // Obtener todos los talleres
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Condición de búsqueda: si el usuario no es administrador, excluir los talleres eliminados
    const condicion = user.rol !== "administrador" ? { estado: Not("eliminado") } : {};
     // Si no es administrador, excluir los talleres eliminados

    // Obtener los talleres con la condición de búsqueda y relaciones
    const talleres = await tallerRepository.find({
      where: condicion,
      relations: ["profesor", "usuarios"], // Cargar relación con profesor y usuarios
    });

    if (!talleres || talleres.length === 0) return [null, "No hay talleres"];

    return [talleres, null];
  } catch (error) {
    console.error("Error al obtener los talleres:", error);
    return [null, "Error interno del servidor"];
  }
}
   // claro, solo cambia de estado el taller a eliminado 

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
   if (profesor.rol !== "profesor") {
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
    select: ["email"], // Solo necesitamos los correos electrónicos
  });
  const correosEstudiantes = estudiantes.map(estudiante => estudiante.email).join(","); 
  // Unimos los correos en una cadena
  const asunto = `Nuevo Taller Creado: ${nombre}`;
  const texto = `Estimado(a) alumno(a),\nSe ha creado un nuevo taller: ${nombre}.\nDescripción: ${descripcion}\n 
  \nProfesor : ${profesor.nombreCompleto}\nFecha de inicio: ${fechaInicioConvertida}
  \nFecha de fin: ${fechaFinConvertida}`;

  // Llamamos a la función para enviar el correo
  enviarCorreo(correosEstudiantes, asunto, texto);  
return tallerGuardado

  //si, para notificar a alumnos que se creo un taller. si
  

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
      const profesor = await userRepository.findOneBy({ id: body.profesorId, rol: "profesor" });

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
      select: ["email"], // Solo necesitamos los correos electrónicos de los alumnos inscritos
    });
    if (estudiantes.length > 0) {
      // Unimos los correos en una cadena
      const correosEstudiantes = estudiantes.map(estudiante => estudiante.email).join(","); 
      
      const asunto = `Actualización Taller: ${tallerFound.nombre}`;
      const texto = `Estimado(a) alumno(a),\nSe ha actualizado información del taller: ${tallerFound.nombre}.`;
      enviarCorreo(correosEstudiantes, asunto, texto); 
    }
  
       //ahi tambien envia correo a los alumnos del taller que se actualizo el taller
  
    return [tallerFound, null];
  } catch (error) {
    console.error("Error al actualizar el taller:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteStudentService(req) { 
  // Eliminar alumno de un taller
  const { tallerId, alumnoId } = req.params;
  
  const tallerRepository = AppDataSource.getRepository(Taller);

  // Obtener el taller especificado con sus relaciones
  const taller = await tallerRepository.findOne({
    where: { id: tallerId },
    relations: ["usuarios"],
  });
  
  if (!taller) throw { statusCode: 404, message: "Taller no encontrado" };

  // Buscar y eliminar al alumno del taller
  
  const alumnoIndex = taller.usuarios.findIndex((u) => u.id === parseInt(alumnoId, 10));
  if (alumnoIndex === -1) throw { statusCode: 400, message: "El alumno no está inscrito en este taller" };

  taller.usuarios.splice(alumnoIndex, 1);
  taller.inscritos -= 1; 
  await tallerRepository.save(taller);  

  const mejs = await anadirAutomaticoUser();
  console.log(mejs);  // Llamada a la función para inscribir automáticamente a un alumno de la lista de espera

  return taller; // Devuelve el taller actualizado
}

//esa funcion solo la puede ejecutar un administrador

// Eliminar un taller
export async function deleteTallerService(id) { // Eliminar un taller
  try {

    
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Buscar el taller por su ID
    const tallerFound = await tallerRepository.findOneBy({ id });
    if (!tallerFound) return [null, "Taller no encontrado"];

    if (tallerFound.estado === "enCurso") {
      return [null, "No se puede eliminar un taller en curso"];
    }

    
    
    tallerFound.estado = "eliminado"; // Cambiar el estado del taller a 'eliminado'
    await tallerRepository.save(tallerFound);

    return [tallerFound, null]; // Retornar el taller eliminado (por si acaso)
  } catch (error) {
    console.error("Error al eliminar el taller:", error);
    return [null, "Error interno del servidor"];
  }
}





export const inscribirAlumnoAutenticadoService = async (userId, tallerId) => { 
  // Inscribir a un alumno en un taller siendo un estudiante autenticado
  try {//--------------
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);
    const Lista = AppDataSource.getRepository(ListaDeEspera)

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
    //verrificae si esta inscrito en la lista de espera
    const isAlreadyEnrolledLista = await Lista.findOne({ where: { alumno: user, taller, estado: "espera" } });
    if (isAlreadyEnrolledLista) {
      return { success: false, statusCode: 400, message: "Ya estás inscrito en la lista de espera de este taller" };
    }
    // Verificar si hay cupos disponibles y agregar a la lista de espera si el taller está lleno
    if (taller.usuarios.length >= taller.capacidad) {
      // Agregar a la lista de espera si el taller está lleno
      const nuevaEntrada = Lista.create({
        alumno: user,
        taller,
        estado: "espera",
      });
      await Lista.save(nuevaEntrada);
      return { success: true,statusCode: 202, 
        message: "El taller está lleno. El alumno ha sido agregado a la lista de espera." };
    }

// Verificar si el taller está en estado "eliminado"
if (taller.estado === "eliminado") {
  return { success: false, statusCode: 400, message: "No se puede inscribir en un taller eliminado" };
}


    // Inscribir al usuario
    taller.usuarios.push(user);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    // Enviar correo al profesor
    const mensajeProfesor = `Se inscribió al taller "${taller.nombre}" el alumno ${user.nombreCompleto}.
     La cantidad de inscritos es: ${taller.inscritos}.`;
    enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

    // Enviar correo al alumno
    const mensajeAlumno = `Te has inscrito con éxito al taller "${taller.nombre}".`;
    enviarCorreo(user.email, "Inscripción exitosa al taller", mensajeAlumno);

    return { 
      success: true, taller, message: "Te has inscrito al taller con éxito y se han enviado los correos de confirmación"
     };
  } catch (error) {
    console.error("Error en inscribirAlumnoService:", error);
    return { success: false, statusCode: 500, message: "Error interno del servidor" };
  }
};


export const inscribirAlumnoService = async (tallerId, alumnoId) => { // inscribir a un alumno en un taller
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);
    const Lista = AppDataSource.getRepository(ListaDeEspera);

    // Buscar el taller
    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"],
    });
    if (!taller) return { success: false, error: "Taller no encontrado", statusCode: 404 };

    
    const user = await userRepository.findOne({ where: { id: userId } }); 
    // Verificar si el usuario es un profesor o administrador
    if(user.rol==="profesor"){
      if (taller.profesor.id !== userId) {
        return { error: "No tienes permisos para inscribir alumnos en este taller", statusCode: 403 };
      }
    }

    // Verificar si el alumno existe
    const alumno = await userRepository.findOne({ where: { id: alumnoId } });
    if (!alumno) return { success: false, error: "Alumno no encontrado", statusCode: 404 };

    // Verificar si el usuario tiene el rol de estudiante
    if (alumno.rol !== "estudiante") {
      return { success: false, error: "El usuario no tiene el rol de estudiante", statusCode: 400 };
    }

    // Verificar si el alumno ya está inscrito
    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === alumnoId);
    if (isAlreadyEnrolled) return { success: false, 
      error: "El alumno ya está inscrito en este taller", statusCode: 400 };

    

    // Verificar capacidad del taller
    if (taller.usuarios.length >= taller.capacidad) {
      // Agregar a la lista de espera si el taller está lleno
      const nuevaEntrada = Lista.create({
        alumno: user,
        taller,
        estado: "espera",
      });
      await Lista.save(nuevaEntrada);
      return { success: true, 
        message: "El taller está lleno. El alumno ha sido agregado a la lista de espera.", taller: null };
    }

    // Verificar si el taller está eliminado
    if (taller.estado === "eliminado") {
      return { success: false, error: "No se puede inscribir en un taller eliminado", statusCode: 400 };
    }

    // Inscribir al alumno en el taller
    taller.usuarios.push(alumno);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    // Enviar correos de confirmaciónr
    const mensajeProfesor = `Se inscribió al taller "${taller.nombre}" el alumno ${alumno.nombreCompleto}.
    La cantidad de inscritos es: ${taller.inscritos}.`;
   enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

   const mensajeAlumno = `Te has inscrito con éxito al taller "${taller.nombre}".`;
   enviarCorreo(alumno.email, "Inscripción exitosa al taller", mensajeAlumno);


    
    

 // Retornar éxito con el mensaje correcto
    return { success: true, message: "Alumno inscrito correctamente en el taller", taller };
  } catch (error) {
    console.error("Error en inscribirAlumnoService:", error);
    return { success: false, error: "Error interno del servidor", statusCode: 500 };
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
      return { error: "Alumno no encontrado", statusCode: 404 };
    }

    // Verificar si el alumno está inscrito en algún taller
    const talleresInscritos = alumno.talleres.filter(
      (taller) => taller.estado !== "eliminado"
    );

    if (talleresInscritos.length === 0) {
      return { message: "No estás inscrito en ningún taller", talleres: [] };
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
      where: { estado : Not ("eliminado"), profesor: { id: profesorId } }, // Buscar por el ID del profesor
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


export const obtenerTalleresInscritosProfesor1Service = async (profesorId, tallerId) => {
  try {
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Obtener los talleres asignados al profesor
    const talleresAsignados = await tallerRepository.find({
      where: { profesor: { id: profesorId } }, // Buscar por el ID del profesor
      relations: ["usuarios"],
    });

    const taller = talleresAsignados.find((t) => t.id === tallerId);
    if (!taller) {
      return { success: false, error: "Taller no encontrado", statusCode: 404 };
    }
   
    return { success: true, taller };
  } catch (error) {
    console.error("Error en obtenerTalleresInscritosProfesor1Service:", error);
    return { success: false, error: "Error interno del servidor", statusCode: 500 };
  }
};
