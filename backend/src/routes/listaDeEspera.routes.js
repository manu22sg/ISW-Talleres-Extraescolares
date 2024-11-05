// listaDeEspera.routes.js
import { Router } from "express";
import { inscribirEnListaDeEspera } from "../controllers/listaDeEspera.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminorTeacher } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

// Ruta para inscribir a un alumno en la lista de espera o directamente en el taller
router.post("/inscripcion", isAdminorTeacher, inscribirEnListaDeEspera);

export default router;
