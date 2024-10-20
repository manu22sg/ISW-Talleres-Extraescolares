import { Router } from "express";
import {
  getTallerController,
  getTalleresController,
  createTallerController,
  updateTallerController,
  deleteTallerController,
  inscribirAlumnoPorProfesorOAdmin,
  eliminarAlumnoPorProfesorOAdmin
} from "../controllers/taller.controller.js";
import { esProfesor, isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas para los talleres
router.get("/",  getTalleresController); // Obtener todos los talleres
router.get("/:id", getTallerController); // Obtener un taller por id o nombre
router.post("/", isAdmin, createTallerController); // Crear un nuevo taller
router.delete("/:tallerId/alumno/:alumnoId", isAdmin,eliminarAlumnoPorProfesorOAdmin); // Eliminar un alumno de un taller
router.patch("/:id", isAdmin/* esprofesor*/, updateTallerController); // Actualizar un taller por su id
router.delete("/:id", isAdmin, deleteTallerController); // Eliminar un taller por su id
router.post("/inscripcion", isAdmin, inscribirAlumnoPorProfesorOAdmin); // ingresa alumno



export default router;
