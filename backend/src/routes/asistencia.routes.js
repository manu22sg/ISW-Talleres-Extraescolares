import express from "express";
import { obtenerInscritosSesion, registrarAsistencia } from "../controllers/asistencia.controller.js";

const router = express.Router();

// Ruta para obtener la lista de estudiantes inscritos en una sesión específica de un taller
router.get("/talleres/:tallerId/sesiones/:sesionId/inscritos", obtenerInscritosSesion);

// Ruta para registrar o actualizar la asistencia en una sesión
router.post("/talleres/:tallerId/sesiones/:sesionId/asistencia", registrarAsistencia);

export default router;
