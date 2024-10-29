import { Router } from "express";
import {
  getTallerController,
  getTalleresController,
  createTallerController,
  updateTallerController,
  deleteTallerController,
  deleteStudentController,
  talleresInscritosProfesorController,
  inscribirAlumnoPorProfesorOAdminController
} from "../controllers/taller.controller.js";
import { isAdmin, isAdminorTeacher, isTeacher } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas para los talleres
router.get("/",  getTalleresController); // Obtener todos los talleres 
router.get("/:id", getTallerController); // Obtener un taller por id  
router.post("/", isAdmin, createTallerController); // Crear un nuevo taller 
router.delete("/:tallerId/alumno/:alumnoId", isAdmin,deleteStudentController); //Eliminar alumno de un taller
router.patch("/:id", isAdmin, updateTallerController); // Actualizar un taller por su id 
router.patch("/:id/eliminar", isAdmin, deleteTallerController); // Cambiar el estado de un taller a eliminado
router.post("/inscripcion", isAdminorTeacher, inscribirAlumnoPorProfesorOAdminController); // Inscribir alumno a taller
router.get("/profesor/Tallerprofesor",isTeacher,talleresInscritosProfesorController ); // Obtener talleres inscritos siendo profesor



export default router;
