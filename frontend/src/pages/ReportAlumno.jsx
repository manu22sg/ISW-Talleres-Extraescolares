import React from "react";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorAlert } from "../helpers/sweetAlert.js";
import { alumnosTaller } from "../services/report.service.js";
import ListaDinamica from "../components/ListAllTalleresStudent.jsx";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import '@styles/home.css';


async function datos(id){
    try {
        const [response, errorResponse] = await alumnosTaller(id);
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
                console.log("estado de res:",  respuesta)
                if(respuesta.status === "Client error"){
                    showErrorAlert("Rut ingresado sin coincidencia");
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
        const tableColumn = ["nombre", "Rut", "Email", "Nombre Taller", "Descripcion Taller"]; 
        const tableRows = info.talleres[0].map(item => [
            info.nombre, 
            info.rut, 
            info.email,
            item.nombre,
            item.descripcion
        ]);

        doc.text("Talleres del Alumno", 70, 20);
        doc.text("Nombre: " + info.nombre, 14, 30);

        doc.autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("Alumno talleres inscritos.pdf");
    };

    const generateExcel = () => {
        const ws = XLSX.utils.json_to_sheet(info.talleres[0].map(item => ({
            "Nombre Alumno": info.nombre,
            "Rut": info.rut,
            "Email": info.email,
            "Nombre Taller": item.nombre,
            "Descripcion Taller": item.descripcion
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Talleres de Alumno");

        XLSX.writeFile(wb, "TalleresDeAlumno.xlsx");
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
