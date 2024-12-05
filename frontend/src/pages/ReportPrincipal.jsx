import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { tallerinscritos } from "../services/report.service.js";
import ListaDinamica from "../components/ListAllStudtTalle.jsx";
//import { useAuth } from '@context/AuthContext';
import '@styles/Home.css';

async function datos(id){
    try {
        const response = await tallerinscritos(id);
        // console.log("respuesta de la api:", response);
        if(!response) {
            //console.error('Error en la respuesta del servidor');
            return [];
        }
        const data = await response;
        console.log("datos obtenidos de la api:", data);

        return data;
    } catch (error) {
        console.error('Error al obtener los talleres:', error);
        return [];
    }
};

const Report = () => {
    const location = useLocation();
    const {id} = location.state;
    const [info, setInfo] = useState([]);

    useEffect(() => {
        if(!id)return;
        
        const cargarDatos = async()=>{
            try {
                const respuesta = await datos(id);
                setInfo(respuesta) ;
            } catch (error) {
                console.error('Error al obtener los talleres:', error); 
                setInfo([]);
            }
        };
        cargarDatos(); 
    }, [id]);

    useEffect(() => {
        console.log("Contenido de info:", info); // Verifica cuando info cambie
    }, [info]);

    return (
        <div className="home-container">
           <ListaDinamica items={info}/>
        </div>
    );
};

export default Report;