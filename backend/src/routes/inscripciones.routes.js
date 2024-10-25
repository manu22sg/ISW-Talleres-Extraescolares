"use strict";
import { Router } from "express";
import { inscribirEstudiante } from "../controllers/inscripcion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Ruta para inscribir un estudiante en un taller
router.post("/:taller_id/inscripciones", authenticateJwt, inscribirEstudiante);

export default router;
