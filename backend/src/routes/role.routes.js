// role.routes.js
import { Router } from "express";
import { cambiarRolController } from "../controllers/role.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

// Ruta para cambiar el rol de un usuario
router.patch("/cambiar-rol", isAdmin, cambiarRolController);

export default router;
