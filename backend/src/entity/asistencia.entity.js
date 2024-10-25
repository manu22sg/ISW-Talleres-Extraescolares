"use strict";
import { EntitySchema } from "typeorm";

const AsistenciaSchema = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencia",
  columns: {
    asistencia_id: {
      type: "int",
      primary: true,
      generated: true,
    },
    sesion_id: {
      type: "int",
      nullable: false,
    },
    estudiante_id: {
      type: "int",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    comentarios: {
      type: "text",
      nullable: true,
    },
  }
});

export default AsistenciaSchema;
