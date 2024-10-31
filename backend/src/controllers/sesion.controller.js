import { crearSesionService } from "../services/sesion.service.js";

// Controlador para crear una nueva sesión en un taller
export async function crearSesion(req, res) {
  const { tallerId } = req.params;
  const { fecha, estado } = req.body;
  const idProfesor = req.user.id; // Usar el ID del profesor obtenido del middleware de autenticación
  
  const result = await crearSesionService(tallerId, fecha, estado, idProfesor); // se agrega idProfesor
  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.json(result);
}
