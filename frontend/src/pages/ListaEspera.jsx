import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '@context/AuthContext';
import '@styles/Home.css'; 
import { getListadeespera } from '../services/listaEspera.service';
import ListaDinamica from '../components/Lista';
import { useEffect, useState } from 'react';


async function datos(){
    try {
        const data = await getListadeespera();
        return data.details;
      } catch (error) {
        console.error("Error al obtener la lista de espera:", error);
      } 
};

const ListaEspera=  () => {
    // Estado para almacenar la lista de espera
  const [listaEspera, setListaEspera] = useState([]);
  // useEffect para cargar la lista de espera cuando el componente se monte
  useEffect(() => {
    const cargarListaDeEspera =  async () => {
      const respuesta = await datos();
      //console.log(respuesta);
      setListaEspera(respuesta);
    };
    cargarListaDeEspera();
  }, []);

  return (
    <div>
      <ListaDinamica items={listaEspera} />
    </div>
  );
};
export default ListaEspera;