// role.controller.js
import { cambiarRolUsuario } from "../services/role.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const cambiarRolController = async (req, res) => {
  try {
    const { userId, nuevoRol } = req.body;
    console.log(nuevoRol);
    // Validación de roles (opcional)
    if (!["administrador", "profesor", "estudiante"].includes(nuevoRol)) {
      return handleErrorClient(res, 400, "Rol inválido");
    }

    const { success, message, usuario } = await cambiarRolUsuario(userId, nuevoRol);

    if (!success) {
      return handleErrorClient(res, 404, message);
    }

    return handleSuccess(res, 200, message, usuario);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
};
