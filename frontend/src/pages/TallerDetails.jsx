import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { getTaller } from '@services/taller.service';
import '@styles/Talleres.css';

const TallerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);

  useEffect(() => {
    const fetchTaller = async () => {
      try {
        const response = await getTaller(id);
        setTaller(response.data.data);
      } catch (error) {
        console.error("Error al obtener el taller:", error);
      }
    };

    fetchTaller();
  }, [id]);

  if (!taller) {
    return <p>Cargando detalles del taller...</p>;
  }

  return (
    <div className="taller-details-container">
      <div className="taller-details-content">
        <h1>Detalles del Taller</h1>
        <p><strong>ID:</strong> {taller.id}</p>
        <p><strong>Nombre:</strong> {taller.nombre}</p>
        <p><strong>Descripción:</strong> {taller.descripcion}</p>
        <p><strong>Fecha de Inicio:</strong> {taller.fecha_inicio ? format(parseISO(taller.fecha_inicio), 'dd/MM/yyyy') : ''}</p>
        <p><strong>Fecha de Fin:</strong> {taller.fecha_fin ? format(parseISO(taller.fecha_fin), 'dd/MM/yyyy') : ''}</p>
        <p><strong>Estado:</strong> {taller.estado}</p>
        <p><strong>Profesor ID:</strong> {taller.profesor?.id}</p>
        <p><strong>Capacidad:</strong> {taller.capacidad}</p>
        <button onClick={() => navigate(-1)} className="taller-back-button">Volver</button>
      </div>
    </div>
  );
};

export default TallerDetails;
