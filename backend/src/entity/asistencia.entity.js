"use strict";
import { EntitySchema } from "typeorm";

const AsistenciaSchema = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencias",
  columns: {
    id: {
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
    sesion: {
      type: "many-to-one",
      target: "Sesion",
      joinColumn: { name: "sesion_id" },
      onDelete: "CASCADE",
    },
    estudiante: {
      type: "many-to-one",
      target: "User", // Cambia "User" al nombre de la entidad de estudiante si es distinto
      joinColumn: { name: "estudiante_id" },
      onDelete: "CASCADE",
    },
  },
});

export default AsistenciaSchema;
