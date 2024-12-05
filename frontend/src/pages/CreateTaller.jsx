import React, { useState } from 'react';
import { createTaller,validarProfesorRut } from '@services/taller.service';
import { format, parse } from 'date-fns';
import '@styles/talleres.css';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const CreateTallerForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    capacidad: '',
    profesorRut: '', 
    estado: 'enCurso',
  });

  

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      // Validar el RUT del profesor
      const profesorId = await validarProfesorRut(formData.profesorRut);
      if (!profesorId) {
        showErrorAlert('Error', 'El RUT del profesor no es válido o no corresponde al de un profesor.');
        return;
      }
  
      const fechaInicioFormateada = format(parse(formData.fecha_inicio, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
      const fechaFinFormateada = format(parse(formData.fecha_fin, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
  
   
      const { profesorRut, ...rest } = formData;
  
      const dataToSend = {
        ...rest,
        fecha_inicio: fechaInicioFormateada,
        fecha_fin: fechaFinFormateada,
        profesorId, // Enviar solo el ID del profesor al backend
      };
  
      const response = await createTaller(dataToSend);
  
      showSuccessAlert('Haz creado con éxito el taller', response.nombre);
      setFormData({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        capacidad: '',
        profesorRut: '',
        estado: 'enCurso',
      });
    } catch (error) {
      showErrorAlert(
        'Error interno del servidor',
        error.message || 'Ocurrió un problema al crear el taller.'
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h2>Crear Nuevo Taller</h2>
      <form onSubmit={handleSubmit} className="create-taller-form">
        <label>
          Nombre del taller:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Fecha de inicio:
          <input
            type="date"
            name="fecha_inicio"
            value={formData.fecha_inicio}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Fecha de fin:
          <input
            type="date"
            name="fecha_fin"
            value={formData.fecha_fin}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Capacidad:
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          RUT del Profesor:
          <input
            type="text"
            name="profesorRut"
            value={formData.profesorRut}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Estado:
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="enCurso">en Curso</option>
            <option value="pendiente">pendiente</option>
            
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Taller'}
        </button>
      </form>
    </div>
  );
};

export default CreateTallerForm;
