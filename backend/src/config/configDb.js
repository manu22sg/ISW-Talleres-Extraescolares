"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: HOST,        // Se usa directamente la variable sin literales de template
  port: 5432,
  username: DB_USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: ["src/entity/**/*.js"], // Asegúrate de que esta ruta apunte al directorio correcto de tus entidades
  synchronize: true,   // Solo para desarrollo; en producción esto debe ser false
  logging: false,      // Cambia a true si necesitas más detalles de las consultas SQL
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1); // Termina la aplicación si la conexión falla
  }
}
