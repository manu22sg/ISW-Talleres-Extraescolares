import React from 'react';
import '@styles/Table.css'; 


const ListaDinamica = ({ items }) => {
  console.log(items.length);
  if (!items || items.length === 0) {
    return <p>No hay elementos para mostrar.</p>;
  }
  

  return (
    <div>
    <h1>Lista de espera</h1>
    {items.map((item,index) => (
      
      <div className='table-container'key={index.id}>
       
        <table>
          <tr>
            <th>Fecha de inscripcion</th>
            <th>Nombre completo del alumno</th>
            <th>Taller inscripcion pendiente</th>
            <th>Estado</th>
          </tr>
          <tr>
            <td>{item.createdAt}</td>
            <td>{item.alumno.nombreCompleto}</td>
            <td>{item.taller.nombre}</td>
            <td>{item.estado}</td>
          </tr>
        </table>
      </div>
    ))}
    </div>
  );
 
};

export default ListaDinamica;
