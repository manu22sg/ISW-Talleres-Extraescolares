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
        const response = await axios.post('/taller/', taller);
        return response.data.data;
    } catch (error) {
        throw new Error("Error al crear el taller.");
    }
};

export const updateTaller = async (data, id) => {
    try {
        console.log(data) ;
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
        const responde = await axios.get(`/taller/${id}`);
        return responde;
    }
    catch(error){
        throw new Error("Error al obtener el taller.");
    }
}

export const inscribirAlumno = async (idTaller, idAlumno) => {
    try {
        const response = await axios.post(`/taller/${idTaller}/inscripcion`, { alumnoId: idAlumno });
        return response;
    } catch (error) {
        throw error;
    }
};