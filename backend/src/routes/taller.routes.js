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
import { isAdmin, isAdminorTeacher } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt);
// Rutas para los talleres
router.get("/",  getTalleresController); // Obtener todos los talleres CHECK
router.get("/:id", getTallerController); // Obtener un taller por id  CHECK
router.post("/", isAdmin, createTallerController); // Crear un nuevo taller CHECK
router.delete("/:tallerId/alumno/:alumnoId", isAdminorTeacher,deleteStudentController); //CHECk
router.patch("/:id", isAdminorTeacher, updateTallerController); // Actualizar un taller por su id CHECK
   //check  
router.delete("/:id", isAdmin, deleteTallerController); // Eliminar un taller por su id CHECK
router.post("/inscripcion", isAdminorTeacher, inscribirAlumnoPorProfesorOAdmin); // ingresar alumno CHECK
router.get("/profesor/Tallerprofesor",isAdminorTeacher,TalleresInscritosProfesor ); // obtener talleres inscritos no check



export default router;
