"use strict";
import { Router } from "express";
import { crearSesion } from "../controllers/sesion.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Ruta para crear una sesión en un taller
router.post("/:taller_id/sesiones", authenticateJwt, crearSesion);

export default router;
