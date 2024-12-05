import React from 'react';
import '@styles/Table.css';

const ListaDinamica = ({items}) => {
    // console.log("items:", items);
    // Validar que items no sea null o undefined
    if (!items || !Array.isArray(items.talleres) ||!Array.isArray(items.talleres[0])) {
        return <p>El alumno no esta inscrito enningun taller.</p>;
    }

    return (
        <div>
            <h1>Lista del taller y sus alumnos inscritos</h1>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            
                            <th>Nombre alumno</th>
                            <th>Rut</th>
                            <th>Email</th>
                            <th>Nombre Taller</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.talleres[0].map((taller, index) => (
                            <tr key={index}>
                                <td>{items.nombre}</td>
                                <td>{items.rut}</td>
                                <td>{items.email}</td>
                                <td>{taller.nombre}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaDinamica;