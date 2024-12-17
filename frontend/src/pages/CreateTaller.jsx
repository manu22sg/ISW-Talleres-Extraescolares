import React, { useState } from 'react';
import { createTaller, validarProfesorRut } from '@services/taller.service';
import { format, parse } from 'date-fns';
import '@styles/talleres.css';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import validarRut from '../fuctions/validarRut';

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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'profesorRut') {
      const formattedRut = setRutFormat(value);
      setFormData({ ...formData, [name]: formattedRut });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      // Validar el RUT del profesor
      const profesorId = await validarProfesorRut(formData.profesorRut);
      if (!profesorId) {
        showErrorAlert('Error', 'El RUT del profesor no corresponde al de un profesor.');
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
        'Error al crear el taller',
        error.message || 'Ocurrió un problema al crear el taller.'
      );
    } finally {
      setLoading(false);
    }
  };

  function setRutFormat(rut) {
    let rutString = rut.toString().replace(/[^0-9kK]/g, ''); // Eliminar cualquier carácter no numérico
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
        {error && <p className="error-message">{error}</p>}
        <label>
          Estado:
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="enCurso">en Curso</option>
            <option value="Pendiente">Pendiente</option>
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
