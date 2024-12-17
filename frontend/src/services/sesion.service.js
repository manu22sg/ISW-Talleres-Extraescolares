// src/services/sesion.service.js
import axios from './root.service'; // Importa la instancia configurada de Axios

// Crear una nueva sesión en un taller específico
export const crearSesion = async (tallerId, sesionData) => {
  try {
    const response = await axios.post(`/sesion/talleres/${tallerId}/sesiones`, sesionData);
    console.log(response.data.sesion);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Actualizar una sesión existente
export const actualizarSesion = async (sesionId, sesionData) => {
  try {
    const response = await axios.patch(`/sesion/sesiones/${sesionId}`, sesionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Obtener las sesiones de un taller
export const obtenerSesionesPorTaller = async (tallerId) => {
  try {
    const response = await axios.get(`/sesion/talleres/${tallerId}/sesiones`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Eliminar una sesión
export const eliminarSesion = async (sesionId) => {
  try {
    const response = await axios.delete(`/sesion/sesiones/${sesionId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};