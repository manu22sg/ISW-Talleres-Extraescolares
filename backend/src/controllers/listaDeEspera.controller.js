// listaDeEspera.controller.js
import { AppDataSource } from "../config/configDb.js";
import ListaDeEspera from "../entity/listaDeEspera.entity.js";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";
import { enviarCorreo } from "../helpers/nodemailer.helper.js";



export const inscribirEnListaDeEspera = async (req, res) => {
  const { tallerId, alumnoId } = req.body;

  try {
    const tallerRepository = AppDataSource.getRepository(Taller); // trae toda la tabla lista de espera
    const userRepository = AppDataSource.getRepository(User); // trae toda la tabla usurios
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera); // trae la tabla lista de espera

    const taller = await tallerRepository.findOne({
      where: { id: tallerId },
      relations: ["usuarios", "profesor"],
    });

    if (!taller) {
      return res.status(404).json({
        status: "Client error",
        message: "Taller no encontrado",
        details: {},
      });
    }

    const alumno = await userRepository.findOne({ where: { id: alumnoId } });

    if (!alumno) {
      return res.status(404).json({
        status: "Client error",
        message: "Alumno no encontrado",
        details: {},
      });
    }

    const isAlreadyEnrolled = taller.usuarios.some((u) => u.id === alumnoId);

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        status: "Client error",
        message: "El alumno ya está inscrito en este taller",
        details: {},
      });
    }

    if (taller.usuarios.length >= taller.capacidad) {
      const nuevaEntrada = listaDeEsperaRepository.create({
        alumno,
        taller,
        estado: "espera",
      });
      await listaDeEsperaRepository.save(nuevaEntrada);

      const mensajeAlumno = `Estimado(a) ${alumno.nombreCompleto},\nz\n
      El taller "${taller.nombre}" está actualmente lleno. Has sido agregado(a) a la lista de espera. 
      Te notificaremos cuando haya un cupo disponible.\n\nSaludos,\nEquipo de Talleres`;
      enviarCorreo(alumno.email, "Agregado a la lista de espera", mensajeAlumno);

      return res.status(200).json({
        status: "Success",
        message: "El taller está lleno. El alumno ha sido agregado a la lista de espera.",
        details: {},
      });
    }

    taller.usuarios.push(alumno);
    taller.inscritos += 1;
    await tallerRepository.save(taller);

    //const mensajeProfesor = `Se ha inscrito al taller "${taller.nombre}" el alumno ${alumno.nombreCompleto}. 
    // La cantidad de inscritos es: ${taller.inscritos}.`;
    //enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

    const mensajeAlumno = `Has sido agregado a la lista de espera del taller: "${taller.nombre}".`;
    enviarCorreo(alumno.email, "Inscripción exitosa a la lista de espera", mensajeAlumno);

    return res.status(200).json({
      status: "Success",
      message: "El alumno se ha inscrito al taller con éxito.",
      details: {},
    });
  } catch (error) {
    console.error("Error en inscribirEnListaDeEspera:", error);
    return res.status(500).json({
      status: "Server error",
      message: "Error interno del servidor",
      details: {},
    });
  }
};

export const anadirAutomaticoUser = async (req,res) => {
  try {
    console.log("Verificando lista de espera");
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);
    const tallerRepository = AppDataSource.getRepository(Taller);
    
    const entradasEnEspera = await listaDeEsperaRepository.find({
      where: { estado: "espera" },
      relations: ["alumno", "taller"],
    });
    
    for (const entrada of entradasEnEspera) {
      const taller = await tallerRepository.findOne({
        where: { id: entrada.taller.id },
        relations: ["usuarios"],
      });
 
      if (taller.usuarios.length < taller.capacidad) {
        taller.usuarios.push(entrada.alumno);
        taller.inscritos += 1;
        await tallerRepository.save(taller);

        entrada.estado = "inscrito";
        await listaDeEsperaRepository.save(entrada);

        
        //enviarCorreo(entrada.alumno.email, "Inscripción al taller", mensajeAlumno);
        return ("Usuario añadido de lista de espera a taller");
      }
    }
    return ("no hay taller con capacidad para agregar usuario");
  } catch (error) {
    return ("Error en verificarListaDeEspera:", error);
  }
};

export const verListaDeEspera = async (req, res) => {
  try {
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);
    const listaDeEspera = await listaDeEsperaRepository.find({
      relations: ["alumno", "taller"],
    });
    if (!listaDeEspera) {
      return res.status(404).json({
        status: "Client error",
        message: "Lista de espera no encontrada",
        details: {},
      });
    }
    
    return res.status(200).json({
      status: "Success",
      message: "Lista de espera obtenida con éxito",
      details: listaDeEspera,
    });
  } catch (error) {
    console.error("Error en verListaDeEspera:", error);
    return res.status(500).json({
      status: "Server error",
      message: "Error interno del servidor",
      details: {},
    });
  }
}


export const eliminarDeListaDeEspera = async (req, res) => {
  const { id } = req.params;

  try {
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);
    const entrada = await listaDeEsperaRepository.findOne({ where: { id } });

    if (!entrada) {
      return res.status(404).json({
        status: "Client error",
        message: "Alumno no encontrado en la lista de espera",
        details: {"El Alumno no existe ": id},
      });
    }

    await listaDeEsperaRepository.remove(entrada);

    return res.status(200).json({
      status: "Success",
      message: "Alumno eliminado de la lista de espera",}
    );
  }
  catch (error) {
    console.error("Error en eliminarDeListaDeEspera:", error);
    return res.status(500).json({
      status: "Server error",
      message: "Error interno del servidor",
      details: {},
    });
  }
}

export const ActualizarEstadoListaDeEspera = async (req, res) => {

  const { id} = req.body;
  try{
      //traer contexto de autenticacion
      const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);
      const entrada = await listaDeEsperaRepository.findOne({ where: { id } ,relations: ["alumno"] });
      const userRepository = AppDataSource.getRepository(User);
      const userFound = await userRepository.findOne(
        { where: {email: req.user.email}
        });

      if (!entrada) {
        return res.status(404).json({
          status: "Client error",
          message: "Alumno no encontrado en la lista de espera",
          details: {"El Alumno no existe ": id},
        });
      }
      if (!userFound) {
        return res.status(404).json({
          status: "Client error",
          message: "Usuario no encontrado en la base de datos",
          details: {},
        });
      }
      if (userFound.email !== entrada.alumno.email) {
        return res.status(403).json({
          status: "Client error",
          message: "No puedes cambiar el estado de otro alumno",
          details: {},

        });

      }
      entrada.estado = "desinscrito";
      await listaDeEsperaRepository.save(entrada);
      console.log(entrada);
      return res.status(200).json({
        status: "Success",
        message: "Estado de la lista de espera actualizado",
        details: {},
      });
  }catch(error)
  {
    // Manejo de errores
    console.error("Error en ActualizarEstadoListaDeEspera:", error);
    return res.status(500).json({
      status: "Server error",
      message: "Error interno del servidor",
      details: { error: error.message },
    });
  }
  
}
