import axios from './root.service'

export const tallerinscritos = async (id) => { //recolecta los alumnos inscritos en un taller
    try {
        const response = await axios.get(`/report/talleres/${id}`);

        // console.log(response.data.data.nombre);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const alumnosTaller = async (id) => {//recolecta los talleres inscritos por un alumno
    try {
        const response = await axios.get(`/report/alumnos/${id}`);
        // console.log("content service",response.data.data);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const cantidadInscritos = async () => {//mostrar la cantidad de inscritos de los talleres
    try {
        const response = await axios.get(`/report/cantidadInscritos`);

        // console.log(response.data.data);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const Asistencia = async (id) => { //recolecta la asistencia del taller
    try {
        const response = await axios.get(`/report/asistencia/${id}`);
        // console.log("content service",response.data.data[0]);
    return response.data.data[0];
    } catch (error) {
        return error.responce.data
    }
}

export const EstadoTaller = async (estado) => { //recolecta la asistencia del taller
    try {
        const response = await axios.get(`/report/estado/${estado}`);

        // console.log("estado service",response.data);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const TalleresProfesor = async () => {//mostrar talleres con sus respectivos preofesor
    try {
        const response = await axios.get(`/report/tallerProfesor`);

        // console.log(response.data.data);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const Profesor = async (nombre) => {//mostrar los talleres del profesor
    try {
        const response = await axios.get(`/report/profesorTaller/${nombre}`);//aqui ver como se envia un body

        // console.log("respuesta de service",response);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}