import { Router } from "express";
import {
  registrarAsistencia,
  obtenerAsistenciaPorSesion,
  finalizarSesion,
  obtenerHistorialAsistencia
} from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Ruta para registrar la asistencia de un estudiante en una sesión
router.post("/:sesion_id/asistencia", authenticateJwt, registrarAsistencia);

// Ruta para obtener la lista de asistencia de una sesión específica
router.get("/:sesion_id/asistencia", authenticateJwt, obtenerAsistenciaPorSesion);

// Ruta para finalizar una sesión
router.post("/:sesion_id/finalizar", authenticateJwt, finalizarSesion);

// Ruta para obtener el historial de asistencia de un estudiante específico
router.get("/historial/:estudiante_id", authenticateJwt, obtenerHistorialAsistencia);

export default router;
