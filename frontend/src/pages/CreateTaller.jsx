import React, { useState } from 'react';
import { createTaller } from '@services/taller.service';
import { format, parse } from 'date-fns';
import '@styles/talleres.css';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
 

const CreateTallerForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    capacidad: '',
    profesorId: '',
    estado: 'enCurso',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fechaInicioFormateada = format(parse(formData.fecha_inicio, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
      const fechaFinFormateada = format(parse(formData.fecha_fin, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');

      const dataToSend = {
        ...formData,
        fecha_inicio: fechaInicioFormateada,
        fecha_fin: fechaFinFormateada,
      };

      const response = await createTaller(dataToSend);
      
      showSuccessAlert('Haz creado con exito el taller', response.nombre);
      setFormData({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        capacidad: '',
        profesorId: '',
        estado: 'enCurso',
      });
    } catch (error) {
      setMessage('Error: No se pudo crear el taller. Revisa los datos ingresados.');
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
          Profesor ID:
          <input
            type="text"
            name="profesorId"
            value={formData.profesorId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Estado:
          <select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="enCurso">en Curso</option>
            <option value="pendiente">pendiente</option>
            <option value="finalizado">finalizado</option>
          </select>
        </label>
        <button type="submit">Crear Taller</button>
        
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTallerForm;
