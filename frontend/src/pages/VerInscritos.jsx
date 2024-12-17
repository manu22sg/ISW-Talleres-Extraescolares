import  { useState } from 'react';
import { obtenerInscritosSesion } from '../services/asistencia.service';
import Editar from '../components/Editar';
import '../styles/VerInscritos.css';

const VerInscritos = () => {
  const [tallerId, setTallerId] = useState('');
  const [sesionId, setSesionId] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datos,setDatos] = useState({estado:''});

  const abrirModal = (Estudiantes) => {
    setMostrarModal(true);
    setDatos(Estudiantes);
  }

  const cerrarModal = () => {
    setMostrarModal(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEstudiantes([]);

    try {
      const response = await obtenerInscritosSesion(tallerId, sesionId)
      
      setEstudiantes(response.data.estudiantes);
    } catch (err) {
      setError(err.response?.data?.error || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='div'>
      <h1>Ver Estudiantes Inscritos en la Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tallerId">Codigo del Taller:</label>
          <input
            type="text"
            id="tallerId"
            value={tallerId}
            onChange={(e) => setTallerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="sesionId">Codigo de la Sesión:</label>
          <input
            type="text"
            id="sesionId"
            value={sesionId}
            onChange={(e) => setSesionId(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
        
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {estudiantes.length > 0 && (
        <div>
          <h2>Lista de Estudiantes Inscritos</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Estado</th>
                <th>Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.id}</td>
                  <td>{estudiante.nombreCompleto}</td>
                  <td>{estudiante.estado}</td>
                  <td>{estudiante.comentarios || 'Sin comentarios'}</td>
                  <button className='button-2' type="submit" onClick={()=>abrirModal(estudiante)}>Editar</button>
                </tr>
                
              ))}
            </tbody>
            {mostrarModal && <Editar cerrarModal={cerrarModal} Estudiantes={datos} taller={tallerId} sesion={sesionId} />}
          </table>
        </div>
      )}
      {estudiantes.length === 0 && loading && !error && (<p>No se encontraron estudiantes inscritos para esta sesión.</p>)}
    </div>
  );
};

export default VerInscritos;
