"use strict";
import { EntitySchema } from "typeorm";

const SesionSchema = new EntitySchema({
  name: "Sesion",
  tableName: "sesiones",
  columns: {
    sesion_id: {
      type: "int",
      primary: true,
      generated: true,
    },
    taller_id: {
      type: "int",
      nullable: false,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 20,
      default: "en curso",
    }
  }
});

export default SesionSchema;
