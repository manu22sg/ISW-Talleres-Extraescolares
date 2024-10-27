import { Router } from "express";
import { inscribirAlumnoAutenticadoController, talleresInscritosController } from "../controllers/taller.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isStudent } from "../middlewares/authorization.middleware.js";


const router = Router();
router
.use(authenticateJwt).use(isStudent);

router.post("/", inscribirAlumnoAutenticadoController); // Ruta para que los estudiantes se inscriban en un taller
router.get("/mis-talleres",talleresInscritosController); // Ruta para obtener los talleres inscritos por un estudiante

export default router;
