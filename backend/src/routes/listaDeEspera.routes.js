// listaDeEspera.routes.js
import { Router } from "express";
import { inscribirEnListaDeEspera, anadirAutomaticoUser, verListaDeEspera } from "../controllers/listaDeEspera.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminorTeacher } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router.get("/",verListaDeEspera);
// Ruta para inscribir a un alumno en la lista de espera o directamente en el taller
//middleware isSistema 
router.post("/inscripcion", inscribirEnListaDeEspera);

// Ruta para verificar la lista de espera de un taller específico
router.get("/verificar/:tallerId", isAdminorTeacher, anadirAutomaticoUser);

export default router;
