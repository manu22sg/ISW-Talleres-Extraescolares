import React, { useState } from 'react';
import axios from '../services/root.service';


const RegistrarAsistencia = () => {
  const [tallerId, setTallerId] = useState('');
  const [sesionId, setSesionId] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddStudent = () => {
    setAsistencias([...asistencias, { usuarioId: '', estado: '', comentarios: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newAsistencias = [...asistencias];
    newAsistencias[index][field] = value;
    setAsistencias(newAsistencias);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `/asistencia/talleres/${tallerId}/sesiones/${sesionId}/asistencia`,
        { asistencias }
      );
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registrar Asistencia</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tallerId">ID del Taller:</label>
          <input
            type="text"
            id="tallerId"
            value={tallerId}
            onChange={(e) => setTallerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="sesionId">ID de la Sesión:</label>
          <input
            type="text"
            id="sesionId"
            value={sesionId}
            onChange={(e) => setSesionId(e.target.value)}
            required
          />
        </div>

        <h2>Estudiantes</h2>
        {asistencias.map((asistencia, index) => (
          <div key={index}>
            <label>Estudiante {index + 1}:</label>
            <input
              type="text"
              placeholder="ID del Usuario"
              value={asistencia.usuarioId}
              onChange={(e) => handleInputChange(index, 'usuarioId', e.target.value)}
              required
            />
            <select
              value={asistencia.estado}
              onChange={(e) => handleInputChange(index, 'estado', e.target.value)}
              required
            >
              <option value="">Seleccionar Estado</option>
              <option value="Presente">Presente</option>
              <option value="Ausente">Ausente</option>
              <option value="Tarde">Tarde</option>
            </select>
            <input
              type="text"
              placeholder="Comentarios (opcional)"
              value={asistencia.comentarios}
              onChange={(e) => handleInputChange(index, 'comentarios', e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddStudent}>
          Añadir Estudiante
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar Asistencia'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>Éxito: {success}</p>}
    </div>
  );
};

export default RegistrarAsistencia;
