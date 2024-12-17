import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { updateTaller, getTaller } from '@services/taller.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/talleres.css';

const EditTaller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: '',
    capacidad: 0,
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchTaller = async () => {
      try {
        const taller = await getTaller(id);
        const initialData = {
          nombre: taller.nombre || '',
          descripcion: taller.descripcion || '',
          estado: taller.estado || '',
          fecha_inicio: taller.fecha_inicio ? format(parseISO(taller.fecha_inicio), 'dd/MM/yyyy') : '',
          fecha_fin: taller.fecha_fin ? format(parseISO(taller.fecha_fin), 'dd/MM/yyyy') : '',
          capacidad: taller.capacidad,
        };
        setFormData(initialData);
        setOriginalData(initialData);
      } catch (error) {
        console.error("Error al obtener el taller:", error);
      }
    };
    fetchTaller();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.replace(/\D/g, '');

    if (formattedValue.length >= 3 && formattedValue.length <= 4) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    } else if (formattedValue.length >= 5) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}/${formattedValue.slice(4, 8)}`;
    }

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSaveEdit = async () => {
    if (!originalData) return;

    const changes = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== originalData[key]) {
        acc[key] = formData[key] || null;
      }
      return acc;
    }, {});

    try {
      if (Object.keys(changes).length > 0) {
        await updateTaller(changes, id);
      }
      showSuccessAlert('¡Actualizado!', 'El taller ha sido actualizado correctamente.');
      navigate('/talleres');
    } catch (error) {
      showErrorAlert('Error al actualizar taller', error.response.data.message);
    }
  };

  return (
    <div className="edit-taller-container">
      <div className="edit-taller-content">
        <h2>Editar Taller {id}</h2>
        <div className="taller-field">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="taller-field">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="taller-field">
        <label>Estado:</label>
          <select
            name="estado"
            value={formData.estado || ''}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un estado</option>
            <option value="enCurso">En Curso</option>
            <option value="finalizado">Finalizado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <div className="taller-field">
          <label>Fecha de Inicio:</label>
          <input
            type="text"
            name="fecha_inicio"
            placeholder="DD/MM/YYYY"
            value={formData.fecha_inicio || ''}
            onChange={handleDateInputChange}
          />
        </div>
        <div className="taller-field">
          <label>Fecha de Fin:</label>
          <input
            type="text"
            name="fecha_fin"
            placeholder="DD/MM/YYYY"
            value={formData.fecha_fin || ''}
            onChange={handleDateInputChange}
          />
        </div>
        <div className="taller-field">
          <label>Capacidad:</label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="taller-button-container">
          
          <button onClick={() => navigate('/talleres')} className="taller-cancel-button">Cancelar</button>
          <button onClick={handleSaveEdit} className="taller-save-button">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaller;
