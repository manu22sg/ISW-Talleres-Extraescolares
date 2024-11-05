// listaDeEspera.controller.js
import { AppDataSource } from "../config/configDb.js";
import ListaDeEspera from "../entity/listaDeEspera.entity.js";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export const inscribirEnListaDeEspera = async (req, res) => {
  try {
    const { tallerId, alumnoId } = req.body;

    const tallerRepository = AppDataSource.getRepository(Taller);
    const alumnoRepository = AppDataSource.getRepository(User);
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);

    const taller = await tallerRepository.findOne({ where: { id: tallerId } });
    const alumno = await alumnoRepository.findOne({ where: { id: alumnoId } });

    if (!taller || !alumno) {
      return handleErrorClient(res, 404, "Taller o alumno no encontrado.");
    }

    // Verificar si el alumno ya está inscrito en el taller
    const yaInscrito = await listaDeEsperaRepository.findOne({
      where: { taller: { id: tallerId }, alumno: { id: alumnoId }, estado: "inscrito" },
    });

    if (yaInscrito) {
      return handleErrorClient(res, 400, "El alumno ya está inscrito en el taller.");
    }

    // Verificar si hay cupos disponibles
    if (taller.inscritos < taller.capacidad) {
      // Inscribir directamente al alumno
      taller.inscritos += 1;
      await tallerRepository.save(taller);

      const nuevaInscripcion = listaDeEsperaRepository.create({
        alumno,
        taller,
        estado: "inscrito",
      });
      await listaDeEsperaRepository.save(nuevaInscripcion);

      return handleSuccess(res, 200, "Alumno inscrito correctamente en el taller.");
    } else {
      // Agregar a la lista de espera
      const enListaDeEspera = await listaDeEsperaRepository.findOne({
        where: { taller: { id: tallerId }, alumno: { id: alumnoId }, estado: "espera" },
      });

      if (enListaDeEspera) {
        return handleErrorClient(res, 400, "El alumno ya está en la lista de espera.");
      }

      const nuevaListaDeEspera = listaDeEsperaRepository.create({
        alumno,
        taller,
        estado: "espera",
      });
      await listaDeEsperaRepository.save(nuevaListaDeEspera);

      return handleSuccess(res, 200, "El taller está lleno. El alumno ha sido agregado a la lista de espera.");
    }
  } catch (error) {
    console.error("Error al inscribir en lista de espera:", error);
    return handleErrorServer(res, 500, "Error interno del servidor.");
  }
};

// Función para verificar la lista de espera y mover alumnos a inscritos si hay cupos
export const verificarListaDeEspera = async () => {
  try {
    const listaDeEsperaRepository = AppDataSource.getRepository(ListaDeEspera);
    const tallerRepository = AppDataSource.getRepository(Taller);

    // Obtener todos los registros en lista de espera
    const enEspera = await listaDeEsperaRepository.find({
      where: { estado: "espera" },
      relations: ["taller"],
      order: { createdAt: "ASC" }, // Ordenar por fecha de creación para respetar el orden de inscripción
    });

    for (const registro of enEspera) {
      const taller = registro.taller;

      // Verificar si hay cupos disponibles
      if (taller.inscritos < taller.capacidad) {
        // Inscribir al alumno
        taller.inscritos += 1;
        await tallerRepository.save(taller);

        registro.estado = "inscrito";
        await listaDeEsperaRepository.save(registro);

        console.log(`Alumno con ID ${registro.alumno.id} inscrito en el taller ${taller.nombre}.`);
      }
    }
  } catch (error) {
    console.error("Error al verificar la lista de espera:", error);
  }
};
