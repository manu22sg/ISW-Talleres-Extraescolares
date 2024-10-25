"use strict";
import { Router } from "express";
import { registrarAsistencia, obtenerAsistenciaPorSesion, finalizarSesion } from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Proteger las rutas con autenticación JWT
router.use(authenticateJwt);

// Ruta para registrar la asistencia de los estudiantes
router.post("/sesiones/:sesion_id/asistencia", registrarAsistencia);

// Ruta para obtener la asistencia de una sesión específica
router.get("/sesiones/:sesion_id/asistencia", obtenerAsistenciaPorSesion);

// Ruta para finalizar una sesión
router.put("/sesiones/:sesion_id/finalizar", finalizarSesion);

export default router;
