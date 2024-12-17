import axios from './root.service'

export const getTalleres = async () => {
  try {
    const response = await axios.get('/taller/');
    
     // Ajusta el endpoint si es necesario
    return response.data.data;
  } catch (error) {
    throw new Error("Error al obtener los talleres.");
  }
};


export const createTaller = async (taller) => {
    try {
        const response = await axios.post('/taller', taller);
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data.message);
    }
};

export const updateTaller = async (data, id) => {
    // eslint-disable-next-line no-useless-catch
    try {
        console.log(data);
        const response = await axios.patch(`/taller/${id}`, data);
        return response;
        
    } catch (error) {
        
        throw error;
    }
};

export const deleteTaller = async (id) => {
    try {
        console.log(id);
        const response = await axios.patch(`/taller/${id}/eliminar`);
        
        
        return response;
    } catch (error) {
        throw error;
    }
};

export const getTaller = async(id) => {
    try{
        const response = await axios.get(`/taller/${id}`);
        return response;
    }
    catch(error){
        throw new Error("Error al obtener el taller.");
    }
}

export const inscribirAlumno = async (tallerId, alumnoId) => {
    try {
      const response = await axios.post('/taller/inscripcion', { tallerId, alumnoId });
      console.log (response);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const borrarAlumno = async (tallerId, alumnoId) => {
    try {
      console.log(tallerId, alumnoId);
      const response = await axios.delete(`/taller/${tallerId}/alumno/${alumnoId}`);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  export const getTalleresProfesor = async () => {
    try {
      const response = await axios.get('/taller/profesor/Tallerprofesor');
      console.log(response.data.message.talleres);
      return response.data.message.talleres;
    } catch (error) {
      throw new Error("Error al obtener los talleres.");
    }
  }

  export const getTalleresEstudiante = async () => {
    try {
      const response = await axios.get('estudiante/mis-talleres');
      console.log(response.data.message.talleres);
      return response.data.message.talleres;
    } catch (error) {
      throw new Error("Error al obtener los talleres.");
    }
  }
  
  export const inscribirComoEstudiante = async (tallerId) => {
    try {
      const response = await axios.post('/estudiante', { tallerId });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }