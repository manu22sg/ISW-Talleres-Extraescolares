import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { inscribirAlumno, borrarAlumno,validarEstudianteRut } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/talleres.css';


const ManageAlumnos = () => {
  const { id } = useParams(); 
  const [alumnoRut, setAlumnoRut] = useState('');
  const navigate = useNavigate();

  

  const handleAlumnoIdChange = (e) => {
    setAlumnoRut(e.target.value);
  };

  const handleInscribir = async () => {
    try {
      const alumnoId = await validarEstudianteRut(alumnoRut);
      await inscribirAlumno(id, alumnoId);
       
      showSuccessAlert('Alumno inscrito en el taller con éxito');
      setAlumnoRut('');
    } catch (error) {
      showErrorAlert('Error al inscribir al alumno', error.response?.data?.message || "Ocurrió un error");
    }
  };
  

  const handleEliminar = async () => {
    try {
     
     const result = await deleteDataAlert();
  
     if (result.isConfirmed) {
      const alumnoId = await validarEstudianteRut(alumnoRut);
    console.log(alumnoId);
        await borrarAlumno(id, alumnoId);
       showSuccessAlert('Alumno eliminado del taller con éxito');}
      setAlumnoRut('');
    } catch (error) {
        showErrorAlert('Error al eliminar al alumno', error.response || "Ocurrió un error");
    }
  };
  const handleBack = () => {
    navigate("/talleres"); // Navegar a talleres
  };
  return (
    <div className="manage-alumnos-container">
  <div className="manage-alumnos-content">
    <h1>Gestionar Estudiantes del Taller {id}</h1>
    
    <input
      type="text"
      placeholder="Rut del Alumno"
      value={alumnoRut}
      onChange={handleAlumnoIdChange}
      className="alumno-field"
    />
    
    <div className="alumno-button-container">
      <button onClick={handleInscribir} className="alumno-inscribir-button">
        Inscribir Estudiante
      </button>
      
      <button onClick={handleEliminar} className="alumno-eliminar-button">
        Eliminar Estudiante
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
