import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
    //  console.log("items alumno:", items);
    // Validar que items no sea null o undefined
    if (!items || !Array.isArray(items.talleres) ||!Array.isArray(items.talleres[0])) {
        return (<div>
            <p>El alumno no esta inscrito enningun taller.</p>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Registro de los talleres que se encuentra inscrito el alumno</h1>
            <div >
                <table className="table-container">
                    <thead>
                        <tr>
                            
                            <th>Nombre alumno</th>
                            <th className='col-rut'>Rut</th>
                            <th>Email</th>
                            <th>Nombre Taller</th>
                            <th>Descripcion Taller</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.talleres[0].map((taller, index) => (
                            <tr key={index}>
                                <td>{items.nombre}</td>
                                <td>{items.rut}</td>
                                <td>{items.email}</td>
                                <td>{taller.nombre}</td>
                                <td>{taller.descripcion}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaDinamica;