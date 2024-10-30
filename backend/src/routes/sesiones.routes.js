"use strict";
import { Router } from "express";
import { crearSesion, obtenerEstudiantesInscritos } from "../controllers/sesion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Ruta para crear una sesión en un taller específico
router.post("/:taller_id/", authenticateJwt, crearSesion);

// Ruta para obtener la lista de estudiantes inscritos en una sesión específica
router.get("/:sesion_id/inscritos", authenticateJwt, obtenerEstudiantesInscritos);

export default router;
