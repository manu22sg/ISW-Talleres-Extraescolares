import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
handleErrorClient,
handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
    return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
    );
    }

    const rolUser = userFound.rol;

    if (rolUser !== "administrador") {
        return handleErrorClient(
            res,
            403,
            "Error al acceder al recurso",
            "Se requiere un rol de administrador para realizar esta acción."
        );
    }
    next();
} catch (error) {
    handleErrorServer(
    res,
    500,
    error.message,
    );
}

}
export async function isStudent(req, res, next) {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Obtener el usuario autenticado a través del token JWT (req.user.email)
      const userFound = await userRepository.findOneBy({ email: req.user.email });
  
      if (!userFound) {
        return res.status(404).json({
          message: "Usuario no encontrado en la base de datos",
        });
      }
  
      // Verificar si el rol del usuario es "estudiante"
      if (userFound.rol !== "estudiante") {
        return res.status(403).json({
          message: "Acción no permitida",
          error: "Solo los estudiantes pueden inscribirse en talleres",
        });
      }
  
      // Si el usuario es un estudiante, continúa con la siguiente acción
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error del servidor",
        error: error.message,
      });
    }
  }
  export async function isTeacher(req, res, next) {
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Obtener el usuario autenticado a través del token JWT (req.user.email)
      const userFound = await userRepository.findOneBy({ email: req.user.email });
  
      if (!userFound) {
        return res.status(404).json({
          message: "Usuario no encontrado en la base de datos",
        });
      }
  
      // Verificar si el rol del usuario es "estudiante"
      if (userFound.rol !== "profesor") {
        return res.status(403).json({
          message: "Acción no permitida",
          error: "Solo los profesores pueden modificar talleres",
        });
      }
  
      // Si el usuario es un estudiante, continúa con la siguiente acción
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error del servidor",
        error: error.message,
      });
    }
  }