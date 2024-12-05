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
