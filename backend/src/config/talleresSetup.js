"use strict";
import TallerSchema from "../entity/taller.entity.js";
import { AppDataSource } from "./configDb.js";

async function createTalleres() {
  try {
    const tallerRepository = AppDataSource.getRepository(TallerSchema);

    const count = await tallerRepository.count();
    if (count > 0) return;

    await Promise.all([
      tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Programación 2",
          descripcion: "Un taller intensivo sobre programación en JavaScript",
          fecha_inicio: new Date("2024-12-10"), // Formato YYYY-MM-DD
          fecha_fin: new Date("2024-12-31"),
          estado: "pendiente",
          capacidad: 30,
          inscritos: 0,
          profesor: { id: 5 }, // ID existente en la base de datos
        })
      ),
      tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Bases de Datos",
          descripcion: "Conceptos avanzados de bases de datos relacionales",
          fecha_inicio: new Date("2025-04-28"),
          fecha_fin: new Date("2025-05-04"),
          estado: "enCurso",
          capacidad: 25,
          inscritos: 0,
          profesor: { id: 7 }, // ID existente en la base de datos
        })
      ),
      tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Diseño Web",
          descripcion: "Creación de sitios web modernos y responsivos",
          fecha_inicio: new Date("2024-10-10"),
          fecha_fin: new Date("2024-12-08"),
          estado: "enCurso",
          capacidad: 20,
          inscritos: 0,
          profesor: { id: 5 }, // ID existente en la base de datos
        })
      ),
      tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Inglés",
          descripcion: "Clases de inglés para principiantes",
          fecha_inicio: new Date("2024-11-15"),
          fecha_fin: new Date("2024-12-15"),
          estado: "pendiente",
          capacidad: 15,
          inscritos: 0,
          profesor: { id: 5 }, // ID existente en la base de datos
        })
      ),
       tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Matemáticas",
          descripcion: "Clases de matemáticas para nivel medio",
          fecha_inicio: new Date("2024-10-15"),
          fecha_fin: new Date("2024-11-15"),
          estado: "eliminado",
          capacidad: 15,
          inscritos: 0,
          profesor: { id: 5 }, // ID existente en la base de datos
        })),
      tallerRepository.save(
        tallerRepository.create({
          nombre: "Taller de Física",
          descripcion: "Clases de física para nivel medio",
          fecha_inicio: new Date("2024-10-15"),
          fecha_fin: new Date("2024-11-15"),
          estado: "enCurso",
          capacidad: 2,
          inscritos: 0,
          profesor: { id: 8 }, // ID existente en la base de datos
        })),
    ]);


    console.log("* => Talleres creados exitosamente");
  } catch (error) {
    console.error("Error al crear talleres:", error);
  }
}

export { createTalleres };
