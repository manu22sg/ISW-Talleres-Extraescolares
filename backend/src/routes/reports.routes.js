import { Router } from "express";
import { asistenciaAlumnosController, 
         cantidadInscritosController, 
         estadoTallerController,
         inscritosAlumnosController,
         inscritosTallerController,
         tallerProfesorController,
         // eslint-disable-next-line sort-imports
         profesorTallerController
        } from "../controllers/report.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

//añadir is admin para que solo los administradores puedan acceder a estos datos
router.get("/talleres/:id",isAdmin, inscritosTallerController);//cuantos alumnos tiene un taller
router.get("/alumnos/:rut", isAdmin, inscritosAlumnosController);//cuantos talleres tiene un alumno
router.get("/asistencia/:id", isAdmin, asistenciaAlumnosController);//mostrar asistencia de un alumno en un taller
router.get("/cantidadInscritos", isAdmin, cantidadInscritosController);//cantidad de inscritos en un taller
router.get("/estado/:estado", isAdmin, estadoTallerController);//talleres con un estado en especifico
router.get("/tallerProfesor", isAdmin, tallerProfesorController);//talleres con su respectivo profesor
router.get("/profesorTaller/:name", isAdmin, profesorTallerController);//mostrar los talleres que tiene asignados

export default router;

