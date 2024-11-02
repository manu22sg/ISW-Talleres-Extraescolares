"use strict";
import { EntitySchema } from "typeorm";

const SesionSchema = new EntitySchema({
  name: "Sesion",
  tableName: "sesiones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
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
    tokenAsistencia: {
      type: "int",
      nullable: true,
    },
    expiracionToken: {
      type: "timestamp with time zone",
      nullable: true,
    },
  },
  relations: {
    taller: {
      type: "many-to-one",
      target: "Taller",
      joinColumn: { name: "taller_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

// Asegúrate de exportar por defecto
export default SesionSchema;
