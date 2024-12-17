import express from "express";
import { obtenerInscritosSesion, registrarAsistencia } from "../controllers/asistencia.controller.js";
import { actualizarEstadoAsistencia } from "../controllers/asistencia.controller.js";
import { vermiAsistencia } from "../controllers/asistencia.controller.js";
import { registrarAsistenciaConToken } from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isStudent, isTeacher } from "../middlewares/authorization.middleware.js";

const router = express.Router();
router.use(authenticateJwt);

// Ruta para obtener la lista de estudiantes inscritos en una sesión específica de un taller
router.get("/talleres/:tallerId/sesiones/:sesionId/inscritos", isTeacher,obtenerInscritosSesion);

// Ruta para obtener la asistencia de un usuario
router.get("/mis-sesiones", authenticateJwt, isStudent , vermiAsistencia);

// Ruta para registrar o actualizar la asistencia en una sesión
router.post("/talleres/:tallerId/sesiones/:sesionId/asistencia",isTeacher, registrarAsistencia);

// Ruta para actualizar el estado de la asistencia
router.patch("/talleres/:tallerId/sesiones/:sesionId/usuarios/:usuarioId/asistencia", 
    authenticateJwt, actualizarEstadoAsistencia);

    
// Ruta para que los estudiantes registren asistencia usando el token
router.post(
    "/talleres/:tallerId/sesiones/:sesionId/registrar", isTeacher , registrarAsistenciaConToken);

export default router;
