import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
    // console.log("items:", items);
    // Validar que items no sea null o undefined
    if (items.length === 0 ) {
        return (<div>
            <p>No hay talleres con el estado: .</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }   

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Lista de talleres con el profesor {(items[0].profesor)} a cargo</h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className='col-alumno'>Profesor</th>
                            <th className='col-rut'>Rut</th>
                            <th className='col-email'>Email</th>
                            <th className='col-id'>Codigo Taller</th>
                            <th className='col-taller'>Nombre Taller</th>
                            <th className='col-descripcion'>Descripcion del taller</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.profesor}</td>
                                <td>{item.rut}</td>
                                <td>{item.email}</td>
                                <td>{item.idTaller}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaDinamica;