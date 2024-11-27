import { Router } from "express";
import {
  createTallerController,
  deleteStudentController,
  deleteTallerController,
  getTallerController,
  getTalleresController,
  inscribirAlumnoPorProfesorOAdminController,
  talleresInscritosProfesor1Controller,
  talleresInscritosProfesorController,
  updateTallerController
} from "../controllers/taller.controller.js";
import { isAdmin, isAdminorTeacher, isTeacher } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas para los talleres
router.get("/",  getTalleresController); // Obtener todos los talleres 
router.get("/:id", getTallerController); // Obtener un taller por id  
router.post("/", createTallerController); // Crear un nuevo taller 
router.delete("/:tallerId/alumno/:alumnoId",deleteStudentController); //Eliminar alumno de un taller
router.patch("/:id", isAdmin, updateTallerController); // Actualizar un taller por su id 
router.patch("/:id/eliminar", isAdmin, deleteTallerController); // Cambiar el estado de un taller a eliminado
<<<<<<< HEAD
router.post("/inscripcion", isAdmin, inscribirAlumnoPorProfesorOAdminController); // Inscribir alumno a taller
router.get("/profesor/Tallerprofesor",isTeacher,talleresInscritosProfesorController );  // Obtener talleres inscritos siendo profesor
router.get("/profesor/taller",isTeacher,talleresInscritosProfesor1Controller); // Obtener talleres inscritos como profesor con tallerId
=======
router.post("/inscripcion", isAdminorTeacher, inscribirAlumnoPorProfesorOAdminController); // Inscribir alumno a taller
<<<<<<< HEAD
// Obtener talleres inscritos siendo profesor
router.get("/profesor/Tallerprofesor",isTeacher,talleresInscritosProfesorController );
// Obtener talleres inscritos como profesor con tallerId
router.get("/profesor/taller",isTeacher,talleresInscritosProfesor1Controller); 
>>>>>>> Miguel
=======
router.get("/profesor/Tallerprofesor",isTeacher,talleresInscritosProfesorController );  // Obtener talleres inscritos siendo profesor
router.get("/profesor/taller",isTeacher,talleresInscritosProfesor1Controller); // Obtener talleres inscritos como profesor con tallerId
>>>>>>> guidoReal

// Obtener talleres inscritos siendo profesor




export default router;
