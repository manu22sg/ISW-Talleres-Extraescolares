"use strict";
import { AppDataSource } from "../config/configDb.js";
import Inscripcion from "../entity/inscripcion.entity.js";
import Taller from "../entity/taller.entity.js";
import User from "../entity/user.entity.js";

export async function inscribirEstudiante(req, res) {
  try {
    const { taller_id } = req.params;
    const { estudiante_id } = req.body;

    // Verifica si el ID del taller es un número
    const tallerId = parseInt(taller_id);
    if (isNaN(tallerId)) {
      return res.status(400).json({ status: "Client error", message: "El ID del taller no es válido." });
    }

    const tallerRepository = AppDataSource.getRepository(Taller);
    const estudianteRepository = AppDataSource.getRepository(User);

    // Verificar que el taller existe
    const taller = await tallerRepository.findOne({ where: { id: tallerId } });
    if (!taller) {
      return res.status(400).json({ status: "Client error", message: "El ID del taller no es válido." });
    }

    // Verificar que el estudiante existe
    const estudiante = await estudianteRepository.findOne({ where: { id: estudiante_id } });
    if (!estudiante) {
      return res.status(400).json({ status: "Client error", message: "El ID del estudiante no es válido." });
    }

    // Registrar la inscripción
    const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
    const nuevaInscripcion = inscripcionRepository.create({ taller_id: tallerId, estudiante_id });

    await inscripcionRepository.save(nuevaInscripcion);

    return res.status(201).json({
      status: "Success",
      message: "Inscripción realizada con éxito",
      data: nuevaInscripcion
    });
  } catch (error) {
    console.error("Error en inscribirEstudiante:", error.message);
    res.status(500).json({ status: "Server error", message: error.message });
  }
}
