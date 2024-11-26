import axios from './root.service.js';

export async function getListadeespera() {
    try {
        const { data } = await axios.get('/listaEspera/');
        return data;
    } catch (error) {
        return error.response.data;
    }
}


