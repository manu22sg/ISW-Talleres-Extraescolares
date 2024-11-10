import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { inscribirAlumno, borrarAlumno } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';


const ManageAlumnos = () => {
  const { id } = useParams(); // Obtener el ID del taller desde la URL
  const [alumnoId, setAlumnoId] = useState('');
  

  const handleAlumnoIdChange = (e) => {
    setAlumnoId(e.target.value);
  };

  const handleInscribir = async () => {
    try {
      await inscribirAlumno(id, alumnoId);

      if (alumnoId ==='')
        showSuccessAlert('Alumno inscrito en el taller con éxito');
      setAlumnoId('');
    } catch (error) {
        showErrorAlert('Error al inscribir al alumno', error.response.data.message);
    }
  };

  const handleEliminar = async () => {
    try {
     
     const result = await deleteDataAlert();
  
     if (result.isConfirmed) {
        await borrarAlumno(id, alumnoId);
       showSuccessAlert('Alumno eliminado del taller con éxito');}
      setAlumnoId('');
    } catch (error) {
        showErrorAlert('Error al eliminar al alumno', error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Gestionar Alumnos del Taller {id}</h1>
      <input
        type="text"
        placeholder="ID del Alumno"
        value={alumnoId}
        onChange={handleAlumnoIdChange}
      />
      <button onClick={handleInscribir}>Inscribir Alumno</button>
      <button onClick={handleEliminar}>Eliminar Alumno</button>
    </div>
  );
};

export default ManageAlumnos;
