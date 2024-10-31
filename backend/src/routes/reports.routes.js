import { Router } from "express";
import { asistenciaAlumnosController, 
         inscritosAlumnosController, 
         inscritosTallerController 
        } from "../controllers/report.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/talleres/:id", inscritosTallerController);
router.get("/alumnos/:id", inscritosAlumnosController);
router.get("/asistencia/:id", asistenciaAlumnosController);

export default router;

