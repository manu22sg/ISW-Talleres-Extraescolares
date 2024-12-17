import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
    // Validar que items no sea null o undefined
    if (items.length === 0 ) {
        return (<div>
            <p>No hay talleres con ese estado</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }   

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Lista de talleres con el estado: {(items[0].estado)}</h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className='col-id'>Codigo</th>
                            <th className='col-taller'>Nombre Taller</th>
                            <th className='col-descripcion'>Descripcion del taller</th>
                            <th className='col-alumno'>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaDinamica;