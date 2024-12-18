import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inscribirAlumno, borrarAlumno, getTaller, validarEstudianteRut } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/talleres.css';
import validarRut from '../fuctions/validarRut';

const ManageAlumnos = () => {
  const { id } = useParams();
  const [alumnoRut, setAlumnoRut] = useState('');
  const [error, setError] = useState('');
  const [tallerNombre, setTallerNombre] = useState('');
  const navigate = useNavigate();

  // Obtén el nombre del taller basado en el id
  useEffect(() => {
    const fetchTallerNombre = async () => {
      try {
        const tallerData = await getTaller(id); // Suponiendo que esta función retorna el taller por id
        setTallerNombre(tallerData.data.data.nombre); 
         // Establece el nombre del taller
        // console.log(tallerData.data.data.nombre);
      } catch (error) {
        showErrorAlert('Error al obtener los detalles del taller', error.response?.data?.message || "Ocurrió un error");
      }
    };
    
    fetchTallerNombre();
  }, [id]);

  const handleAlumnoIdChange = (e) => {
    const formattedRut = setRutFormat(e.target.value);
    setAlumnoRut(formattedRut);
  };

  const handleInscribir = async () => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
      const alumnoId = await validarEstudianteRut(alumnoRut);
      
       await inscribirAlumno(id, alumnoId);
     
      if (result.isConfirmed) {
      showSuccessAlert('Alumno inscrito en el taller con éxito');
      setAlumnoRut('');
      }}
    } catch (error) {
      showErrorAlert('Error al inscribir al alumno', error.response?.data?.message || "Ocurrió un error");
    }
    
  };

  const handleEliminar = async () => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const alumnoId = await validarEstudianteRut(alumnoRut);
        await borrarAlumno(id, alumnoId);
        showSuccessAlert('Alumno eliminado del taller con éxito');
      }
      setAlumnoRut('');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error || "Ocurrió un error";

      showErrorAlert('Error al eliminar al alumno', errorMessage);
    }
  };

  function setRutFormat(rut) {
    let rutString = rut.toString().replace(/[^0-9kK]/g, '');  // Eliminar cualquier carácter no numérico
    if (rutString.length > 9) {
      setError('Largo máximo de 9 caracteres');
    } else {
      setError('');
    }
    if (rutString.length > 8) {
      const dv = rutString.slice(-1);
      const numero = rutString.slice(0, -1);
      const formateado = numero.split('').reverse().reduce((acc, digit, i) => {
        return digit + (i > 0 && i % 3 === 0 ? '.' : '') + acc;
      }, '');
      const rutValido = validarRut(rutString);
      if (!rutValido) {
        setError('Rut inválido');
      }
      return `${formateado}-${dv}`;
    } else {
      return rutString;
    }
  }

  const handleBack = () => {
    navigate("/talleres"); // Navegar a talleres
  };

  return (
    <div className="manage-alumnos-container">
      <div className="manage-alumnos-content">
        <h1>Gestionar Estudiantes del Taller: {tallerNombre}</h1> {/* Muestra el nombre si está disponible */}
        <input
          type="text"
          placeholder="Rut del Alumno"
          value={alumnoRut}
          onChange={handleAlumnoIdChange}
          className="alumno-field"
        />
        {error && <p className="error-message">{error}</p>}
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
