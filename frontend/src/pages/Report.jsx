import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarRut  from "../fuctions/validarRut";
//import ReportPrincial from "./ReportPrincipal";
import '@styles/Home.css';
import '@styles/Table.css';
//import { deleteDataAlert, showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert";

const Report = () => {

    const [idTaller, setidTaller] = useState('');
    const [idAlumno, setidAlumno] = useState('');
    const navigate = useNavigate();

    const handleSubmitIdTaller = () => {
        if(idTaller.trim() !== ''){
            navigate('/ReportPrincipal',{state: {id: idTaller}});
        }else{
            alert('Ingrese un idTaller');
        }
    };

    const manejarCambio = (e) => {
        let nuevoValor = e.target.value;
    
        // Remover cualquier carácter no numérico o 'k'
        nuevoValor = nuevoValor.replace(/[^0-9k]/g, '');
    
        // Si el último carácter es 'k', se mantiene
        if (nuevoValor.length > 9) {
          nuevoValor = nuevoValor.substring(0, 9);
        }
    
        // Aplicar formato xx.xxx.xxx-x
        if (nuevoValor.length <= 2) {
          nuevoValor = nuevoValor;
        } else if (nuevoValor.length <= 5) {
          nuevoValor = nuevoValor.slice(0, 2) + '.' + nuevoValor.slice(2);
        } else if (nuevoValor.length <= 8) {
          nuevoValor = nuevoValor.slice(0, 2) + '.' + nuevoValor.slice(2, 5) + '.' + nuevoValor.slice(5);
        } else {
          nuevoValor = nuevoValor.slice(0, 2) + '.' + nuevoValor.slice(2, 5) + '.' + nuevoValor.slice(5, 8) + '-' + nuevoValor.slice(8, 9);
        }
        // console.log(nuevoValor);  
        setidAlumno(nuevoValor);
      };


    const handleSubmitIdAlumno = () => {
        if(idAlumno.trim() !== ''){
            if(validarRut(idAlumno) == true){
                navigate('/ReportAlumno',{state: {id: idAlumno}});
            }else{
                alert('Ingrese un rut valido');
            }
        }else{
            alert('Ingrese un rut ');
        }
    }

    // //console.log(user);
    // const handleprofe = async (rut) => {
    //     //guatdar datos del rut del profe     
    //     // llamar a componente RepostPrincipal y mandarle el rut
    //     <ReportPrincial rut={rut}/>
    //     setProfe(respuesta);
    // }
    return (
        <div style={{ padding: '50px' }}>
            <table className="">
            <tr>
                <td>
                    <h1>generar lista de alumnos</h1>
                    <p>Ingrese el codigo del taller <br/> para ver la lista de alumnos inscritos</p>
                    
                </td>
                <td>
                    <h2>Ingrese codigo del Taller:</h2>
                    <input
                        type="text"
                        value={idTaller}
                        onChange={(e) => setidTaller(e.target.value)}
                        placeholder="Ingrese el codigo ...."
                        style={{ padding: '8px', width: '300px' }}
                    />
                    <button onClick={handleSubmitIdTaller} style={{ marginLeft: '10px', padding: '8px 16px' }}>
                        Enviar IdTaller
                    </button>
                </td>
            </tr>
            </table>

            <h1>Ingrese el Rut Alumno:</h1>
            <input
                type="text"
                value={idAlumno}
                onChange={(e) => manejarCambio(e)}
                placeholder="Ingrese rut sin punton ni guion"
                style={{ padding: '8px', width: '300px' }}
            />
            <button onClick={handleSubmitIdAlumno} style={{ marginLeft: '10px', padding: '8px 16px' }}>
                Enviar Rut
            </button>
        </div>
    );
}

export default Report;