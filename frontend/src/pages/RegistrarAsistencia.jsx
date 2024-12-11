import { useState } from 'react';
import axios from '../services/root.service';
import {validarRut} from '../function/validarRut';

const RegistrarAsistencia = () => {
  const [tallerId, setTallerId] = useState('');
  const [sesionId, setSesionId] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function setRutFormat(rut) {
    // Convertir el RUT a string por si se ingresa como número
    let rutString = rut.toString().replace(/\D/g, ''); // Eliminar cualquier carácter no numérico
    // Validar largo máximo de 12 caracteres
     if (rutString.length > 9) {
      setError('Largo máximo de 9 caracteres');
    }else{
      setError('');
    }
    if(rutString.length > 8){
      // Separar el dígito verificador
      const dv = rutString.slice(-1);
      const numero = rutString.slice(0, -1);
    
      // Formatear el número con puntos cada 3 dígitos
      const formateado = numero
        .split('')
        .reverse()
        .reduce((acc, digit, i) => {
          return digit + (i > 0 && i % 3 === 0 ? '.' : '') + acc;
        }, '');
      
      const rutValido = validarRut(rutString);
      if(!rutValido){
        setError('Rut inválido');
      }

      return `${formateado}-${dv}`;
    }else{
      return rutString
    }
  }

  const handleAddStudent = () => {
    setAsistencias([...asistencias, { usuarioId: '', estado: '', comentarios: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newAsistencias = [...asistencias];
    newAsistencias[index][field] = value;
    console.log(newAsistencias);
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
              placeholder="rut del Usuario"
              value={asistencia.usuarioId}
              onChange={(e) => handleInputChange(index, 'usuarioId', setRutFormat(e.target.value))}
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

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Éxito: {success}</p>}
    </div>
  );
};

export default RegistrarAsistencia;
