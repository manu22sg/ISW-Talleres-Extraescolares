import axios from './root.service.js';

export async function getListadeespera() {
    try {
        const { data } = await axios.get('/listaEspera/');
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteListadeespera(id) {
    try {
        const { data } = await axios.delete(`/listaEspera/${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateListadeespera(id) {
    try {
        const { data } = await axios.patch(`/listaEspera/${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteEstudianteListadeespera(id) {
    try {
        const { data } = await axios.delete(`/listaEspera/eliminar/${id}`);
        return data;
    } catch (error) {
        return error.response.data;
    }
}

