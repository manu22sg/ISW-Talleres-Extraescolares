"use strict"; 
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import tallerRoutes from "./taller.routes.js"; // Importa las rutas de talleres

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/talleres", tallerRoutes); // Añade las rutas de talleres

export default router; // Usa export default