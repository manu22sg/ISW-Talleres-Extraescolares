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
    tallerId: {
      type: "int",
      nullable: false,
    },
    usuarioId: {
      type: "int",
      nullable: false,
    },
    sesionId: {
      type: "int",
      nullable: false, // Referencia a la sesión específica del taller
    },
    estado: {
      type: "varchar",
      length: 20,
      nullable: false, // Estado de la asistencia (ej., presente, ausente)
    },
    comentarios: {
      type: "text",
      nullable: true, // Comentarios adicionales sobre la asistencia
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
    taller: {
      type: "many-to-one",
      target: "Taller",
      joinColumn: { name: "tallerId" },
      onDelete: "CASCADE",
    },
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "usuarioId" },
      onDelete: "CASCADE",
    },
    sesion: {
      type: "many-to-one",
      target: "Sesion",
      joinColumn: { name: "sesionId" },
      onDelete: "CASCADE",
    },
  },
});

export default AsistenciaSchema;
