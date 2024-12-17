import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/table.css';

const ListaDinamica = ({items}) => {
     console.log("items:", items.alumnos);
    // if(items.status === "Client error"){
    //     return (<div>
    //         <p>El codigo del taller ingresado no existe.</p>
    //         <Link className="home-link" to="/Report">Volver</Link>
    //         </div>
    //     );
    // }
    // Validar que items no sea null o undefined
    if (!items || !Array.isArray(items.alumnos) || !Array.isArray(items.alumnos[0])) {
        return (<div>
            <h1>No Existe el taller .</h1>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }
    // Validar que items.alumnos[0] no sea un arreglo vacío si es asi no hay alumnos inscritos
    if(items.alumnos[0].length === 0){
        return (<div>
            <h1>No hay alumnos inscritos en el taller {(items.nombre)}.</h1>
            <Link className="home-link" to="/Report">Volver</Link>
            </div>
        )
    }

    return (
        <div>
            <Link className="home-link" to="/Report">Volver</Link>
            <h1>Lista de Alumnos Inscritos en el taller: {(items.nombre)}</h1>
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
