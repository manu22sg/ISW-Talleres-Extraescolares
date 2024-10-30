"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import talleresRoutes from "./talleres.routes.js";
import sesionesRoutes from "./sesiones.routes.js";
import inscripcionesRoutes from "./inscripciones.routes.js";
import { inscribirEstudiante } from "../controllers/inscripcion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
  .use("/auth", authRoutes) // Rutas de autenticación
  .use("/user", userRoutes) // Rutas de usuario
  .use("/asistencia", asistenciaRoutes) // Rutas de asistencia
  .use("/talleres", talleresRoutes) // Rutas de talleres
  .use("/talleres/:taller_id/sesiones", sesionesRoutes) // Rutas de sesiones específicas a cada taller
  .post("/talleres/:taller_id/inscripciones", authenticateJwt, inscribirEstudiante); // Ruta para inscribir estudiante en un taller

export default router;
