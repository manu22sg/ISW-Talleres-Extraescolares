import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorAlert } from "../helpers/sweetAlert.js";
import { tallerinscritos } from "../services/report.service.js";
import ListaDinamica from "../components/ListAllStudtTalle.jsx";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '@styles/Home.css';

async function datos(id){   
    try {
        const [response, errorResponse] = await tallerinscritos(id);
        // console.log("respuesta de la api:", response);
        if(response === null) {
            console.log("Error en la respuesta del servidor:", errorResponse);
            return errorResponse;
        }

        return response;
    } catch (error) {
        console.error('Error al obtener los talleres:', error);
        return [];
    }
};

const Report = () => {
    const location = useLocation();
    const {id} = location.state;
    const [info, setInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!id)return;
        
        const cargarDatos = async()=>{
            try {
                const respuesta = await datos(id);
                if(respuesta.status === "Client error"){
                    showErrorAlert("El codigo del taller ingresado no existe.");
                    navigate('/Report');
                    return;
                }

                setInfo(respuesta) ;
            } catch (error) {
                console.error('Error al obtener los talleres:', error); 
                setInfo([]);
            }
        };
        cargarDatos(); 
    }, [id]);

    // useEffect(() => {
    //     console.log("Contenido de info:", info); // Verifica cuando info cambie
    // }, [info]);

    const generatePDF = () => {
        console.log("Generando PDF...");
       
        const doc = new jsPDF();
        const tableColumn = ["Codigo", "Nombre Taller", "Descripcioin del Taller", "Nombre Alumno", "Rut", "Email"]; 
        const tableRows = info.alumnos[0].map(item => [
            info.idTaller, 
            info.nombre,
            info.descripcion, 
            item.nombre,
            item.rut,
            item.email
        ]);

        doc.text("Alumnos Inscritos", 70, 20);
        doc.text("Este documento contiene a los alumnos que se encuentran inscritos", 14, 30);
        doc.text(`Nombre: ${info.nombre}`, 14, 40);
        doc.text(`Descripción: ${info.descripcion}`, 14, 50);

        doc.autoTable({
            startY: 60,// posicion en la que comienza la tabla en la pagina
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("All_Alumnos_Taller.pdf");
    };

    const generateExcel = () => {
        const ws = XLSX.utils.json_to_sheet(info.alumnos[0].map(item => ({
            "Codigo": info.idTaller,
            "Nombre Taller": info.nombre,
            "Descripción del Taller": info.descripcion,
            "Nombre Alumno": item.nombre,
            "Rut": item.rut,
            "Email": item.email
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Alumnos Inscritos");

        XLSX.writeFile(wb, "Alumnos_Inscritos.xlsx");
    };

    return (
        <div>
            <div className="home-container">
                <div id="report"> 
                    <ListaDinamica items={info}/>
                </div>
            </div>
            <div className="button-conteiner">
                <button className="button-pdf" 
                    // style={{
                    //     backgroundColor: '#8d0303', 
                    //     transition: 'background-color 0.2s ease'}} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f80b0b'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8d0303'}
                    onClick={generatePDF}>Generar PDF</button>
                        
                <button className="button-excel" 
                    // style={{
                    //     backgroundColor: '#006400', 
                    //     transition: 'background-color 0.2s ease'}}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#23a523'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#006400'}
                    onClick={generateExcel}>Generar Excel</button>
            </div>
        </div>
    );
};

export default Report;