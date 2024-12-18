// listaDeEspera.routes.js
import { Router } from "express";
import { inscribirEnListaDeEspera, ActualizarEstadoListaDeEspera, anadirAutomaticoUser, verListaDeEspera } from "../controllers/listaDeEspera.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdminorTeacher, isAdmin, isStudent } from "../middlewares/authorization.middleware.js";
import { eliminarDeListaDeEspera } from "../controllers/listaDeEspera.controller.js";


const router = Router();

router.use(authenticateJwt);

router.get("/",verListaDeEspera);
// Ruta para inscribir a un alumno en la lista de espera o directamente en el taller
//middleware isSistema 
router.post("/inscripcion", inscribirEnListaDeEspera);

// Ruta para verificar la lista de espera de un taller específico
router.get("/verificar/:tallerId", isAdminorTeacher, anadirAutomaticoUser);

// Ruta para eliminar a un alumno de la lista de espera, solo administrador
router.delete("/:id", isAdmin, eliminarDeListaDeEspera);
//ruta para eliminar a un alumno de la lista de espera siendo el alumno autenticado
router.delete("/eliminar/:id", isStudent, ActualizarEstadoListaDeEspera);

// ruta para actualizar la lista de espera por alumno
router.patch("/:id", isStudent, anadirAutomaticoUser);

export default router;

