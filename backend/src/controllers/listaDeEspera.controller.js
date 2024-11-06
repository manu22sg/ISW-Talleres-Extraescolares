// listaDeEspera.controller.js
import { AppDataSource } from "../config/configDb.js";
import ListaDeEspera from "../entity/listaDeEspera.entity.js";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";
import { enviarCorreo } from "../helpers/nodemailer.helper.js";

export const inscribirEnListaDeEspera = async (req, res) => {
  const { tallerId, alumnoId } = req.body;

  try {
    const tallerRepository = AppDataSource.getRepository(Taller);
    const userRepository = AppDataSource.getRepository(User);
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);

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

      const mensajeAlumno = `Estimado(a) ${alumno.nombreCompleto},\n\nEl taller "${taller.nombre}" está actualmente lleno. Has sido agregado(a) a la lista de espera. Te notificaremos cuando haya un cupo disponible.\n\nSaludos,\nEquipo de Talleres`;
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

    const mensajeProfesor = `Se ha inscrito al taller "${taller.nombre}" el alumno ${alumno.nombreCompleto}. La cantidad de inscritos es: ${taller.inscritos}.`;
    enviarCorreo(taller.profesor.email, "Nuevo alumno inscrito en tu taller", mensajeProfesor);

    const mensajeAlumno = `Te has inscrito con éxito al taller "${taller.nombre}".`;
    enviarCorreo(alumno.email, "Inscripción exitosa al taller", mensajeAlumno);

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

export const verificarListaDeEspera = async () => {
  try {
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

        const mensajeAlumno = `Estimado(a) ${entrada.alumno.nombreCompleto},\n\nSe ha liberado un cupo en el taller "${taller.nombre}" y has sido inscrito(a) automáticamente. Por favor, verifica los detalles del taller en tu perfil.\n\nSaludos,\nEquipo de Talleres`;
        enviarCorreo(entrada.alumno.email, "Inscripción al taller", mensajeAlumno);
      }
    }
  } catch (error) {
    console.error("Error en verificarListaDeEspera:", error);
  }
};
