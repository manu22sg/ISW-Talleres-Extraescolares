import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { inscribirAlumno, borrarAlumno } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/talleres.css';


const ManageAlumnos = () => {
  const { id } = useParams(); // Obtener el ID del taller desde la URL
  const [alumnoId, setAlumnoId] = useState('');
  const navigate = useNavigate();

  

  const handleAlumnoIdChange = (e) => {
    setAlumnoId(e.target.value);
  };

  const handleInscribir = async () => {
    try {
      await inscribirAlumno(id, alumnoId);
       // Verifica si se llega a esta línea
      showSuccessAlert('Alumno inscrito en el taller con éxito');
      setAlumnoId('');
    } catch (error) {
      showErrorAlert('Error al inscribir al alumno', error.response?.data?.message || "Ocurrió un error");
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
  const handleBack = () => {
    navigate("/talleres"); // Navegar a talleres
  };
  return (
    <div className="manage-alumnos-container">
  <div className="manage-alumnos-content">
    <h1>Gestionar Alumnos del Taller {id}</h1>
    
    <input
      type="text"
      placeholder="ID del Alumno"
      value={alumnoId}
      onChange={handleAlumnoIdChange}
      className="alumno-field"
    />
    
    <div className="alumno-button-container">
      <button onClick={handleInscribir} className="alumno-inscribir-button">
        Inscribir Alumno
      </button>
      
      <button onClick={handleEliminar} className="alumno-eliminar-button">
        Eliminar Alumno
      </button>
    </div>
    
    <button onClick={handleBack} className="alumno-back-button">
      Volver
    </button>
  </div>
</div>

  );
};

export default ManageAlumnos;
