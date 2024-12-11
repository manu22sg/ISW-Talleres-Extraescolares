import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
    //console.log("items:", items);
    // Validar que items no sea null o undefined
    if (!items || !Array.isArray(items.alumnos) || !Array.isArray(items.alumnos[0])) {
        return (<div>
            <p>No hay alumnos inscritos en el taller (items.nombre).</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }   

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Lista del taller y sus alumnos inscritos</h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className='col-id'>IdTaller</th>
                            <th className='col-taller'>Nombre Taller</th>
                            <th className='col-descripcion'>Descripcion del taller</th>
                            <th className='col-alumno'>Nombre Alumno</th>
                            <th className='col-rut'>Rut</th>
                            <th className='col-email'>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.alumnos[0].map((alumnos, index) => (
                            <tr key={index}>
                                <td>{items.idTaller}</td>
                                <td>{items.nombre}</td>
                                <td>{items.descripcion}</td>
                                <td>{alumnos.nombre}</td>
                                <td>{alumnos.rut}</td>
                                <td>{alumnos.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaDinamica;
