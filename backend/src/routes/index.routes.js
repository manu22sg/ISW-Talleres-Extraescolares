"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import talleresRoutes from "./talleres.routes.js"; // Importar las nuevas rutas
import sesionesRoutes from "./sesiones.routes.js";
import inscripcionesRoutes from "./inscripciones.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/asistencia", asistenciaRoutes) // Agregar las rutas de asistencia
    .use("/talleres", talleresRoutes) // Añadir la ruta de talleres
    .use("/talleres", sesionesRoutes) // Añadir la ruta de sesiones
    .use("/talleres", inscripcionesRoutes); // Añadir la ruta de inscripciones

export default router;