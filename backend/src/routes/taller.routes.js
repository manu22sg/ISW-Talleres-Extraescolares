import { Router } from "express";
import {
  getTallerController,
  getTalleresController,
  createTallerController,
  updateTallerController,
  deleteTallerController,
  inscribirAlumnoPorProfesorOAdmin,

  deleteStudentController,
  TalleresInscritosProfesor
} from "../controllers/taller.controller.js";
import { isTeacher, isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas para los talleres
router.get("/",  getTalleresController); // Obtener todos los talleres CHECK
router.get("/:id", getTallerController); // Obtener un taller por id  CHECK
router.post("/", isAdmin, createTallerController); // Crear un nuevo taller CHECK
router.delete("/:tallerId/alumno/:alumnoId", isTeacher,deleteStudentController); //CHECk
router.delete("/:tallerId/alumno/:alumnoId", isAdmin,deleteStudentController); // Eliminar un alumno de un taller CHECK
router.patch("/:id", isAdmin, updateTallerController); // Actualizar un taller por su id CHECK
router.patch("/:id", isTeacher, updateTallerController);   //check  
router.delete("/:id", isAdmin, deleteTallerController); // Eliminar un taller por su id CHECK
router.post("/inscripcion", isAdmin, inscribirAlumnoPorProfesorOAdmin); // ingresar alumno CHECK
router.post("/inscripcion", isTeacher, inscribirAlumnoPorProfesorOAdmin);  //CHECK
router.get("/tallerProfesor",isTeacher,TalleresInscritosProfesor ); // obtener talleres inscritos no check



export default router;
