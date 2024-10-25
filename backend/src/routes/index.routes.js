"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import talleresRoutes from "./talleres.routes.js"; // Importar las nuevas rutas

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/asistencia", asistenciaRoutes) // Agregar las rutas de asistencia
    .use("/talleres", talleresRoutes); // Añadir la ruta de talleres

export default router;