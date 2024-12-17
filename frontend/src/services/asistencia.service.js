import axios from './root.service'

export const obtenerInscritosSesion = async (tallerId,sesionId) => {
  try {
    const response = await axios.get(`/asistencia/talleres/${tallerId}/sesiones/${sesionId}/inscritos`);
    
    return response; // Retorna la lista de inscritos
  } catch (error) {
    console.error("Error al obtener inscritos:", error);
    throw error.response ? error.response.data : error;
  }
};



// Registrar asistencia para una sesión
export const registrarAsistencia = async (tallerId, sesionId, asistencias) => {
  try {
    
    const response = await axios.post(`/asistencia/talleres/${tallerId}/sesiones/${sesionId}/asistencia`, { asistencias });
    console.log("Respuesta de registrar asistencia:", response);
    return response.data; // Mensaje de éxito o error

  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    throw error.response ? error.response.data : error;
  }
};


// Registrar asistencia usando el token
export const registrarAsistenciaConToken = async (tallerId, sesionId, usuarioRut, tokenAsistencia) => {
  try {
    
    console.log("Registrando asistencia con token:", tallerId, sesionId, usuarioRut, tokenAsistencia);
    const response = await axios.post(
      `/asistencia/talleres/${tallerId}/sesiones/${sesionId}/registrar`,
      { usuarioRut, tokenAsistencia }
    );
    return response.data; // Mensaje de éxito o error
  } catch (error) {
    console.error("Error al registrar asistencia con token:", error);
    throw error.response ? error.response.data : error;
  }
};

// Actualizar el estado de la asistencia de un estudiante
export const actualizarEstadoAsistencia = async (
  tallerId,
  sesionId,
  usuarioId,
  nuevoEstado,
  comentarios
) => {
  try {
    const response = await axios.patch(
      `/asistencia/talleres/${tallerId}/sesiones/${sesionId}/usuarios/${usuarioId}/asistencia`,
      { nuevoEstado, comentarios }
    );
    return response.data; // Mensaje de éxito o error
  } catch (error) {
    console.error("Error al actualizar el estado de asistencia:", error);
    throw error.response ? error.response.data : error;
  }
};



