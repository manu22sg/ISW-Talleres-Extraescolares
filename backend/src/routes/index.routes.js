"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import talleres from "./taller.routes.js";
import inscribir from "./student.routes.js";


const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/taller", talleres)
    .use("/estudiantes", inscribir);
    

export default router;