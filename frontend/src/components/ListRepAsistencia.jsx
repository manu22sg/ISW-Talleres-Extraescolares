import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
      console.log("items:", items);
    // Validar que items no sea null o undefined
    if ( !items || !Array.isArray(items) ) {
        return (<div>
            <p>No existe el taller .</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }

    if(items.length === 0){
        return (<div>
            <h1>No hay registro de asistencia en el taller {(items.nombreTaller)} .</h1>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Registro de asistencia del taller </h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            
                            <th className='col-id'>Codigo</th>
                            <th className='col-taller'>Taller</th>
                            <th className='col-alumno'>Nombre Alumno</th>
                            <th className='col-rut'>Rut Alumno</th>
                            <th>Asistencia</th>
                            <th>Comentario</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.idTaller}</td>
                                <td>{item.nombreTaller}</td>
                                <td>{item.nombreAlumno}</td>
                                <td>{item.rutAlumno}</td>
                                <td>{item.asistio}</td>
                                <td>{item.comentario}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaDinamica;