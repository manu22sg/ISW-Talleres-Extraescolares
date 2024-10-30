"use strict";
import { EntitySchema } from "typeorm";

const InscripcionSchema = new EntitySchema({
  name: "Inscripcion",
  tableName: "inscripciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    taller_id: {
      type: "int",
      nullable: false,
    },
    estudiante_id: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  relations: {
    estudiante: {
      type: "many-to-one",
      target: "User", // Esto debe coincidir con el nombre de la entidad del estudiante
      joinColumn: { name: "estudiante_id" },
    },
    taller: {
      type: "many-to-one",
      target: "Taller",
      joinColumn: { name: "taller_id" },
    },
  },
});

export default InscripcionSchema;
