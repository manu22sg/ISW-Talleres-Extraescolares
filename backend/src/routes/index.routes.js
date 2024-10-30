"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import talleresRoutes from "./taller.routes.js";
import estudiantesRoutes from "./student.routes.js";
import reportRoutes from "./reports.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/taller", talleresRoutes)
    .use("/estudiante", estudiantesRoutes)
    .use("/report", reportRoutes);
    

export default router;