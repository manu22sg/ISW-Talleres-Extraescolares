import { useState } from "react";
import { registrarAsistenciaConToken } from "../services/asistencia.service";
import { useAuth } from '@context/AuthContext';

const RegistrarAsistenciaToken = () => {
  const [tallerId, setTallerId] = useState("");
  const [sesionId, setSesionId] = useState("");
  const [tokenAsistencia, setTokenAsistencia] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); 
  const usuarioRut = user?.rut;

  // hacer un alert si rut no existe, ojo con el null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Llama a la función pasando los parámetros requeridos
      const response = await registrarAsistenciaConToken(
        tallerId,
        sesionId,
        usuarioRut, // Suponiendo que el usuario ID se obtiene del contexto o no es necesario
        tokenAsistencia
      );
      console.log("Respuesta de registrar asistencia con token:", response);
      setSuccessMessage("Asistencia registrada correctamente.");
    } catch (error) {
      setErrorMessage(
        error?.error || "Error al registrar asistencia. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registrar Asistencia con Token</h1>
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
        <div>
          <label htmlFor="tokenAsistencia">Token de Asistencia:</label>
          <input
            type="text"
            id="tokenAsistencia"
            value={tokenAsistencia}
            onChange={(e) => setTokenAsistencia(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Asistencia"}
        </button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default RegistrarAsistenciaToken;
