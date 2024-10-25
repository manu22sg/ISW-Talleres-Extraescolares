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
});

export default InscripcionSchema;
