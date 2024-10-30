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
      nullable: false,
    },
    
    fecha_inicio: {
      type: "timestamp with time zone",
      nullable: false,
    },
    fecha_fin: {
      type: "timestamp with time zone",
      nullable: false,
    },
    // Añadimos 'estado' para gestionar el estado del taller
    estado: {
      type: "enum",
      enum: ["pendiente", "enCurso", "finalizado", "eliminado"],
    
      nullable: false,
    },
    capacidad: {
      type: "int",
      nullable: false,
    },
    inscritos: {
      type: "int",
      default: 0, // Cantidad de usuarios inscritos
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
    profesor: {
      target: "User", // Referencia al User con rol "Profesor"
      type: "many-to-one",
      joinColumn: { name: "profesorId" }, // Este será el id de un usuario que es profesor
      nullable: false,
    },
    usuarios: {
      target: "User", // Muchos usuarios pueden inscribirse en el taller
      type: "many-to-many",
      joinTable: {
        name: "inscripciones", // Tabla de unión
        joinColumn: {
          name: "tallerId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "usuarioId",
          referencedColumnName: "id",
        },
      },
    },
    asistencia: {
      target: "User",
      type: "many-to-many",
      joinTable: {
        name: "asistencias",
        joinColumn: {
          name: "tallerId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "usuarioId",
          referencedColumnName: "id",
        },
      },
    },
  },
});

export default TallerSchema;
