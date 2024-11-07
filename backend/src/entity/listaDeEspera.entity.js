// listaDeEspera.entity.js
import { EntitySchema } from "typeorm";

const ListaDeEsperaSchema = new EntitySchema({
  name: "ListaDeEspera",
  tableName: "listas_de_espera",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    estado: {
      type: "enum",
      enum: ["espera", "inscrito"],
      default: "espera",
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
    alumno: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "alumnoId" },
      nullable: false,
    },
    taller: {
      target: "Taller",
      type: "many-to-one",
      joinColumn: { name: "tallerId" },
      nullable: false,
    },
  },
});

export default ListaDeEsperaSchema;
