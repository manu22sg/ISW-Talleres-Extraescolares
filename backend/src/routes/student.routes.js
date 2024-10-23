import { Router } from "express";
import { inscribirAlumno,TalleresInscritos } from "../controllers/taller.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isStudent } from "../middlewares/authorization.middleware.js";


const router = Router();
router
.use(authenticateJwt).use(isStudent);
// Ruta para que los estudiantes se inscriban e n talleres
router.post("/", inscribirAlumno); //check
router.get("/mis-talleres",TalleresInscritos);

export default router;
