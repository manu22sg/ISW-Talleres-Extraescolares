"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import talleresRoutes from "./taller.routes.js";
import estudiantesRoutes from "./student.routes.js";
import reportRoutes from "./reports.routes.js";
import AsistenciaRoutes from "./asistencia.routes.js";
import SesionRoutes from "./sesion.routes.js";
import listaDeEsperaRoutes from "./listaDeEspera.routes.js"; // Importa las rutas de lista de espera
import roleRoutes from "./role.routes.js"; // Nueva ruta de roles


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/taller", talleresRoutes)
    .use("/estudiante", estudiantesRoutes)
    .use("/report", reportRoutes)
    .use("/asistencia", AsistenciaRoutes)
    .use("/sesion", SesionRoutes)
    .use("/lista-de-espera", listaDeEsperaRoutes) // Añade las rutas de lista de espera;
    .use("/role", roleRoutes); // Rutas de roles
    

    

export default router;