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
            <h1>Lista de Talleres y cantidad de Inscritos </h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            <th className='col-id'>Codigo Taller</th>
                            <th className='col-taller'>Nombre Taller</th>
                            <th className='col-descripcion'>Descripcion del taller</th>
                            <th className='col-id'>Cantidad Inscritos</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.nombre}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.cantidad}</td>
                             
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default ListaDinamica;