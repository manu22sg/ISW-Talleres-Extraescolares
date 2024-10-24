"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import talleresRoutes from "./taller.routes.js";
import estudiantesRoutes from "./student.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/taller", talleresRoutes)
    .use("/estudiante", estudiantesRoutes);
    

export default router;