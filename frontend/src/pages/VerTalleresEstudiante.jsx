import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTalleresEstudiante } from '../services/taller.service';

const TalleresEstudiante = () => {
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const data = await getTalleresEstudiante();
        setTalleres(data);
      } catch (error) {
        setError("No se pudieron cargar los talleres.");
      } finally {
        setLoading(false);
      }
    };

    fetchTalleres();
  }, []);

  const handleShowDetails = (id) => {
    navigate(`/talleres/detalles/${id}`);
  };

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  if (loading) return <p>Cargando talleres...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 style={{ marginTop: '130px', marginBottom: '20px', textAlign: 'center' }}>Talleres </h1>
      <ul>
        {talleres.map(taller => (
          <li key={taller.id}>
            <h2>{taller.nombre}</h2>
            <p>{taller.descripcion}</p>
            <p>Estado: {taller.estado}</p>
            <p>Inscritos: {taller.inscritos}</p>
            <button onClick={() => handleShowDetails(taller.id)}>Ver Detalles</button>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center', marginTop: '10px',marginBottom: '30px' }}>
        <button className="taller-back-button" onClick={handleBack}>Volver</button>
      </div>
    </div>
  );
};

export default TalleresEstudiante;
