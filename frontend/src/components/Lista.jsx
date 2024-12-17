import React from 'react';
import '@styles/Table.css'; 
import { useState } from 'react';
import { deleteListadeespera, deleteEstudianteListadeespera } from "../services/listaEspera.service"
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

async function matar(id){
  try {
      const data = await deleteListadeespera(id);
      return data.details;
    } catch (error) {
      console.error("Error al eliminar", error);
    } 
};

async function matarEstudiante(id){
  try {
      const data = await deleteEstudianteListadeespera(id);
      return data.details;
    } catch (error) {
      console.error("Error al eliminar", error);
    } 
};

const ListaDinamica = ({ items }) => {
  // const [idLista, setidListaEspera] = useState();
  
  if ( items.length === 0) {
    return (
      <div>
          <h1 style={{ color: 'black' }} >No hay elementos para mostrar.</h1>
      </div>
    );
  }

  const { user } = useAuth(); 
  const esAdministrador = user.rol === 'administrador';
  // const esProfesor = user.rol === 'profesor';
  const esEstudiante = user.rol === 'estudiante';


  //funcion que controla accion de boton dentro de la lista
  const handleEliminar = (id,alumno,taller) => {
    const confirmacion = confirm(`Estas seguro que deseas eliminar al alumno ${alumno} de la lista de espera del taller: ${taller}`,)
    // console.log(confirmacion);
    if(confirmacion){
      matar(id);
      window.location.reload(); // Recarga la página después de eliminar
    }
  }

  const handleUpdate = (id,taller) => {
    const confirmacion = confirm(`Estas seguro que deseas desinscribirte de la lista de espera del ${taller}`,)
    // console.log(confirmacion);
    if(confirmacion){
      matarEstudiante(id);
      window.location.reload(); // Recarga la página después de eliminar
    }
  }

  const transformarFecha = (fechaISO) => {
    const fecha = new Date(fechaISO); // Crear un objeto Date a partir de la fecha ISO
    const dia = fecha.getDate().toString().padStart(2, "0"); // Obtener el día con dos dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes con dos dígitos
    const anio = fecha.getFullYear(); // Obtener el año
    //const horas = fecha.getHours().toString().padStart(2, "0"); // Obtener las horas con dos dígitos
    //const minutos = fecha.getMinutes().toString().padStart(2, "0"); // Obtener los minutos con dos dígitos
  
    return `${dia}-${mes}-${anio}`; // Formato DD-MM-AAAA-HH-MM
  };
  //funcion renderiza a lista pasada como paramentro en const
  const listaEsperaLista = items.map((item,index)=> 
        <table key={index.id}>
          <tr>
            <th>Fecha de inscripcion</th>
            <th>Nombre completo del alumno</th>
            <th>Taller inscripcion pendiente</th>
            <th>Estado</th>
          </tr>
          <tr>
          <td>{transformarFecha(item.createdAt)}</td>
            <td>{item.alumno.nombreCompleto}</td>
            <td>{item.taller.nombre}</td>
            <td>{item.estado}</td>
          </tr>
          <button onClickCapture={() => handleEliminar(item.id, item.alumno.nombreCompleto,item.taller.nombre)}>
            Eliminar a {item.alumno.nombreCompleto}
            </button>
          
        </table>
  );

  const listaEsperaEstudiante= items.map((item,index)=> 
      {if(item.alumno.email === user.email){ 
        return(
          <table key={index.id}>
           <tr>
          
          <th>Fecha de inscripcion</th>
          <th>Taller inscripcion pendiente</th>
          <th>Estado</th>
        </tr>
        <tr>
          <td>{transformarFecha(item.createdAt)}</td>
          <td>{item.taller.nombre}</td>
          <td>{item.estado}</td>
          <td>
        <button onClickCapture={() => handleUpdate(item.id, item.taller.nombre)}>
          Eliminar Inscripcion
          </button>
        </td>
        </tr>
      
        
          </table>)
          }}

);
  return (
   
   <div>
       {
      esAdministrador &&
      (<>
      <h1>{user.rol}</h1>
        <table>{listaEsperaLista}</table>
        </>)
    }

    {
      esEstudiante &&(
        <>
        <h1>{user.rol}</h1>
           <table>{listaEsperaEstudiante}</table>
        </>
      )
    }
     <Link className="home-link"  to={"/home"}>Volver</Link>
   </div>
   
    
  )
  /*

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
            <td>{item.id}</td>
            <button onChange={handleEliminar(item.id)}></button>
          </tr>
          
        </table>
        
      </div>
    ))}
    </div>
  );*/

};

export default ListaDinamica;