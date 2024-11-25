// role.service.js
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";

export const cambiarRolUsuario = async (userId, nuevoRol) => {
  const userRepository = AppDataSource.getRepository(User);
  
  const usuario = await userRepository.findOneBy({ id: userId });
  
  if (!usuario) {
    return { success: false, message: "Usuario no encontrado" };
  }

  usuario.rol = nuevoRol;
  await userRepository.save(usuario);

  return { success: true, message: "Rol actualizado exitosamente", usuario };
};
