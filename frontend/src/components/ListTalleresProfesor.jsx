import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
    // console.log("items:", items.length);
    // Validar que items no sea null o undefined
    if ( items.length === 0 ) {
        return (<div>
            <p>No hay talleres registrados.</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }   

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Lista de Talleres con su respectivo profesor </h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className='col-id'>Codigo Taller</th>
                            <th className='col-taller'>Nombre Taller</th>
                            <th className='col-descripcion'>Descripcion del taller</th>
                            <th className='col-alumno'>Profesor a cargo</th>
                            <th className='col-rut'>Rut Profesor</th>
                            <th className='col-email'>Correo Profesor</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.profesor}</td>
                                <td>{item.rutProfesor}</td>
                                <td>{item.emailProfesor}</td>
                             
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaDinamica;