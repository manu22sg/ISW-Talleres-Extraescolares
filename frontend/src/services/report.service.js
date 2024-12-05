import axios from './root.service'

export const tallerinscritos = async (id) => {
    try {
        const response = await axios.get(`/report/talleres/${id}`);

        console.log(response.data.data.nombre);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}

export const alumnosTaller = async (id) => {
    try {
        const response = await axios.get(`/report/alumnos/${id}`);

        console.log(response.data.data.nombre);

    return response.data.data;
    } catch (error) {
        return error.responce.data
    }
}