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
      <h1 style={{ marginTop: '100px', marginBottom: '20px', textAlign: 'center', fontSize: '2rem' }}>Talleres </h1>
      <ul>
        {talleres.map(taller => (
          <li key={taller.id} style={{ marginBottom: '10px' }}>
           
          <h2 style={{ fontSize: '1.5em', margin: '5px 0' }}>{taller.nombre}</h2>
            <p>{taller.descripcion}</p>
            <p>Estado: {taller.estado}</p>
            <p>Inscritos: {taller.inscritos}</p>
            <button onClick={() => handleShowDetails(taller.id)} style={{ padding: '8px 15px', fontSize: '1rem', cursor: 'pointer' }}>Ver Detalles</button>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
        <button className="taller-back-button" onClick={handleBack} style={{ padding: '10px 20px', fontSize: '1rem' }}>Volver</button>
      </div>
    </div>
  );
};

export default TalleresEstudiante;

