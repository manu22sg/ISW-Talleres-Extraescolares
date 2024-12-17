
import { useEffect, useState } from "react";
import { TalleresProfesor } from "../services/report.service.js";
import ListaDinamica from "../components/ListTalleresProfesor.jsx";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '@styles/Home.css';

async function datos(){
    try {
        const response = await TalleresProfesor();
        // console.log("respuesta de la api:", response);
        if(!response) {
            //console.error('Error en la respuesta del servidor');
            return [];
        }

        return response;
    } catch (error) {
        console.error('Error al obtener los talleres:', error);
        return [];
    }
};

const Report = () => {
    const [id, setId] = useState([]);
    const [info, setInfo] = useState([]);

    useEffect(() => {
        const cargarDatos = async()=>{
            try {
                const respuesta = await datos();
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
        const tableColumn = ["codigo taller", "Nombre Taller", "Descripcioin del Taller", "Nombre Profesor", "Rut Profesor", "Correo Profesor"]; 
        const tableRows = info.map(item => [
            item.id, 
            item.nombre, 
            item.descripcion,
            item.profesor,
            item.rutProfesor,
            item.emailProfesor
        ]);

        doc.text("Talleres y su profesor ", 70, 20);
        doc.text("Este documento contiene todos los talleres con su profesor a cargo ", 14, 30);

        doc.autoTable({
            startY: 50,// posicion en la que comienza la tabla en la pagina
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("talleresProfesor.pdf");
    };

    const generateExcel = () => {
        const ws = XLSX.utils.json_to_sheet(info.map(item => ({
            "Codigo": item.id,
            "Nombre Taller": item.nombre,
            "Descripción del taller": item.descripcion,
            "Nombre Profesor": item.profesor,
            "Rut Profesor": item.rutProfesor,
            "Correo Profesor": item.emailProfesor
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Talleres");

        XLSX.writeFile(wb, "Talleres.xlsx");
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