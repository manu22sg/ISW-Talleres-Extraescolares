"use strict";
import { EntitySchema } from "typeorm";

const TallerSchema = new EntitySchema({
  name: "Taller",
  tableName: "talleres",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    profesor_id: {
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
    sesiones: {
      type: "one-to-many",
      target: "Sesion", // La entidad relacionada
      inverseSide: "taller", // Nombre de la relación inversa en `Sesion`
    },
  },
});

export default TallerSchema;
