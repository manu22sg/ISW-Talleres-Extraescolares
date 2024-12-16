import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Profesor } from "../services/report.service.js";
import { showErrorAlert } from "../helpers/sweetAlert.js";
import ListaDinamica from "../components/ListProfesor.jsx";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '@styles/Home.css';

async function datos(id){
    try {
        const [response, errorResponse] = await Profesor(id);
        // console.log("respuesta de la api:", response);
        if(response == null){
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
                    showErrorAlert("No existe Profesor con ese nombre");
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
        const tableColumn = ["Profesor ", "Rut", "Email", "Codigo Taller", "Nombre Taller", "Descripcion"]; 
        const tableRows = info.map(item => [
            item.profesor, 
            item.rut, 
            item.email,
            item.idTaller,
            item.nombre,
            item.descripcion
        ]);

        doc.text("Profesor", 70, 20);
        doc.text("Este documento contiene todos los talleres que tiene a cargo el profesor", 14, 30);
        doc.text(`Nombre: ${info[0].profesor}`, 14, 40);

        doc.autoTable({
            startY: 60,// posicion en la que comienza la tabla en la pagina
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("Profesor.pdf");
    };

    const generateExcel = () => {
        const ws = XLSX.utils.json_to_sheet(info.map(item => ({
            "Profesor": item.profesor,
            "Rut": item.rut,
            "Correo": item.email,
            "Codigo Taller": item.idTaller,
            "Nombre Taller": item.nombre,
            "Descripcion": item.descripcion
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Talleres del Profesor");

        XLSX.writeFile(wb, "TalleresDelProfesor.xlsx");
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