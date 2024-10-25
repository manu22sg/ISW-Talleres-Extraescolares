"use strict";
import { Router } from "express";
import { crearTaller } from "../controllers/taller.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

// Ruta para crear un taller
router.post("/", authenticateJwt, crearTaller);

export default router;
