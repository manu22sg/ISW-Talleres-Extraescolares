// src/routes/sesion.routes.js
import express from "express";
import { crearSesion } from "../controllers/sesion.controller.js";
import { actualizarSesion } from "../controllers/sesion.controller.js";
import { obtenerSesionesPorTaller } from "../controllers/sesion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isTeacher } from "../middlewares/authorization.middleware.js";

const router = express.Router();


// Ruta para crear una nueva sesión en un taller específico
router.post("/talleres/:tallerId/sesiones",authenticateJwt,isTeacher, crearSesion);
// Ruta para actualizar una sesión existente
router.patch("/sesiones/:sesionId", authenticateJwt, isTeacher, actualizarSesion);
// Ruta para obtener las sesiones de un taller
router.get("/talleres/:tallerId/sesiones", authenticateJwt, obtenerSesionesPorTaller);

export default router;
