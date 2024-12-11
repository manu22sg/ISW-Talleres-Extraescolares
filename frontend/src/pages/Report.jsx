import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validarRut  from "../fuctions/validarRut";
import { Link } from 'react-router-dom';

import '../styles/report.css';



const Report = () => {

    const [idTaller, setidTaller] = useState('');
    const [idAlumno, setidAlumno] = useState('');
    const [idEstado, setidEstado] = useState('');
    const [idProfesor, setidProfesor] = useState('');
    const [idAsistencia, setidAsistencia] = useState('');
    const navigate = useNavigate();

    const handleSubmitIdTaller = () => {
        if(idTaller.trim() !== ''){
            navigate('/ReportPrincipal',{state: {id: idTaller}});
        }else{
            alert('Ingrese un idTaller');
        }
    };

    const handleSubmitCantInscritos = () => {  
            navigate('/RepCanInscritos');
    };

    const handleSubmitTalleresProfesor = () => {
        navigate('/RepTalleresProfesor');
    }

    const handleSubmitIdAsistencia = () => {
        if(idAsistencia.trim() !== ''){
            navigate('/RepAsistencia',{state: {id: idAsistencia}});
        }else{
            alert('Ingrese un idTaller');
        }
    }

    const handleSubmitEstado = () => {
        
        if(idEstado.trim() !== ''){
            navigate('/RepEstado',{state: {id: idEstado}});
        }else{
            alert('Ingrese un estado');
        }
    }

    const handleSubmitProfesor = () => {
        if(idProfesor.trim() !== ''){
            navigate('/RepProfesor',{state: {id: idProfesor}});
        }else{
            alert('Ingrese un nombre de profesor');
        }
    }

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
          // eslint-disable-next-line no-self-assign
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

    return (
        <div>
            <div>
            <Link className="home-link" to="/Home">Volver</Link>
            {/*alumnos inscritos en cierto taller*/}
            </div>
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Lista de Alumnos</h1>
                </div>
                <div className="column">
                    <h2>
                        Ingrese el código del taller para ver la lista de alumnos inscritos en el taller
                    </h2>
                </div>

                <div className="column">
                    <input 
                        type="text"
                        value={idTaller}
                        onChange={(e) => setidTaller(e.target.value)}
                        placeholder="Ingrese el código ...."
                        className="input"
                    />
                    <button onClick={handleSubmitIdTaller} className="button">
                        Enviar IdTaller
                    </button>
                </div>  
            </div>
            {/*lista de talleres que esta inscrito un alumno */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Lista de Talleres</h1>
                </div>
                <div className="column">
                <h2>
                    Ingrese Rut de alumno para ver la lista de talleres inscritos
                    </h2>
                </div>

                <div className="column">
                    <input
                        type="text"
                        value={idAlumno}
                        onChange={(e) => manejarCambio(e)}
                        placeholder="Ingrese el RUT ...."
                        className="input"
                    />
                    <button onClick={handleSubmitIdAlumno} className="button">
                        Enviar RUT
                    </button>
                </div>  
            </div>   
            {/*cantidad de inscritos en los talleres */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Cantidad Inscritos</h1>
                </div>
                <div className="column">
                <h2>
                    Haga click en el botón para ver la cantidad de inscritos de los diferentes talleres
                    </h2>
                </div>

                <div className="column">
                   
                    <button onClick={handleSubmitCantInscritos} className="button">
                        Enviar 
                    </button>
                </div>  
            </div> 
            {/*Litsa de asistencia de cierto taller */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Lista de asistencia</h1>
                </div>
                <div className="column">
                    <h2>
                        Ingrese el codigo del taller para ver la asistencia de los alumnos
                    </h2>
                </div>

                <div className="column">
                    <input
                        type="text"
                        value={idAsistencia}
                        onChange={(e) => setidAsistencia(e.target.value)}
                        placeholder="Ingrese el código ...."
                        className="input"
                    />
                    <button onClick={handleSubmitIdAsistencia} className="button">
                        Enviar codigo 
                    </button>
                </div>  
            </div>    
            {/*Lista de talleres con cierto estado */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Lista Estado Taller</h1>
                </div>
                <div className="column">
                    <h2>
                        Ingrese un estado para ver los talleres con ese estado
                    </h2>
                </div>

                <div className="column">
                    <input
                        type="text"
                        value={idEstado}
                        onChange={(e) => setidEstado(e.target.value)}
                        placeholder="Ingrese Estado ...."
                        className="input"
                    />
                    <button onClick={handleSubmitEstado} className="button">
                        Enviar Estado 
                    </button>
                </div>  
            </div> 
            {/*lista de talleres con sus respectivos profesor  */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">talleres con sus profesor</h1>
                </div>
                <div className="column">
                <h2>
                    Haga click en el botón para ver los talleres y su profesor a cargo
                    </h2>
                </div>

                <div className="column">
                   
                    <button onClick={handleSubmitTalleresProfesor} className="button">
                        Enviar 
                    </button>
                </div>  
            </div> 
            {/*Lista de profesor con sus talleres a cargo */}
            <div className="columns">
                <div className="column">
                    <h1 className="h1">Profesor</h1>
                </div>
                <div className="column">
                    <h2>
                        Ingrese el nombre del profesor para ver los talleres que tiene asignados
                    </h2>
                </div>

                <div className="column">
                    <input
                        type="text"
                        value={idProfesor}
                        onChange={(e) => setidProfesor(e.target.value)}
                        placeholder="Ingrese nombre rofesor..."
                        className="input"
                    />
                    <button onClick={handleSubmitProfesor} className="button">
                        Enviar Nombre
                    </button>
                </div>  
            </div>
        </div>
    )        
}

export default Report;