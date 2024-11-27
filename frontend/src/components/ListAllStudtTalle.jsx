import React from 'react';
import '@styles/Table.css';

const ListaDinamica = ({items}) => {
    //console.log("items:", items);
    // Validar que items no sea null o undefined
    if (!items || !Array.isArray(items.alumnos) ||!Array.isArray(items.alumnos[0])) {
        return <p>No hay alumnos para mostrar.</p>;
    }

    return (
        <div>
            <h1>Lista del taller y sus alumnos inscritos</h1>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>IdTaller</th>
                            <th>Nombre Taller</th>
                            <th>Descripcion del taller</th>
                            <th>Nombre Alumno</th>
                            <th>Rut</th>
                            <th>Email</th>
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
