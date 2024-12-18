import { useState } from 'react';
import { crearSesion } from '../services/sesion.service';
import { format, parseISO } from 'date-fns';
import {fechaHoy} from '../function/fechaHoy';

const CrearSesion = () => {

 
  const [tallerId, setTallerId] = useState('');
  const [fecha, setFecha] = useState(fechaHoy());
  const [estado, setEstado] = useState('Pendiente');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Validar y manejar la entrada de fechas en formato DD/MM/YYYY
  const handleFechaChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea un número
    let formattedValue = rawValue;

    if (rawValue.length >= 3 && rawValue.length <= 4) {
      formattedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`;
    } else if (rawValue.length >= 5) {
      formattedValue = `${rawValue.slice(0, 2)}/${rawValue.slice(2, 4)}/${rawValue.slice(4, 8)}`;
    }

    setFecha(formattedValue);
  };

  // Validar datos antes de enviar
  const validateForm = () => {
    if (!tallerId) {
      setError('Debe ingresar el ID del taller.');
      return false;
    }
    if (!fecha) {
      setError('Debe seleccionar una fecha válida.');
      return false;
    }
    // Validar que la fecha no sea anterior a hoy
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = parseISO(fecha.split('/').reverse().join('-')).getTime();
    if (selectedDate < today) {
      setError('La fecha no puede ser anterior a hoy.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleCrearSesion = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validación
  
    try {
      const sesionData = { fecha: format(parseISO(fecha.split('/').reverse().join('-')), 'yyyy-MM-dd'), estado };
      const response = await crearSesion(tallerId, sesionData);
      
      setSuccessMessage(`Sesión creada exitosamente: Token Creado: ${response.sesion.tokenAsistencia}, ID de la sesión: ${response.sesion.id}`);
      setError(null);
  
      // Limpiar formulario
      setTallerId('');
      setFecha(fechaHoy());
      setEstado('Pendiente');
    } catch (err) {
      console.error("Error en la creación de la sesión:", err);
      // Mensajes específicos de error
      if (err.error === "Taller no encontrado") {
        setError("No se encontró el taller. Verifique el ID ingresado.");
      } else if (err.error === "No está autorizado para crear una sesión en este taller") {
        setError("No está autorizado para crear una sesión en este taller.");
      } else {
        setError("Error desconocido al crear la sesión.");
      }
      setSuccessMessage(null);
    }
  };
  

  return (
    <div>
      <h1>Crear Sesión</h1>
      <form onSubmit={handleCrearSesion}>
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
          <label htmlFor="fecha">Fecha de la sesión :</label>
          <input
            type="text"
            id="fecha"
            placeholder="DD/MM/YYYY"
            value={fecha}
            onChange={handleFechaChange}
            required
          />
        </div>
        <div>
          <label htmlFor="estado">Estado:</label>
          <input
            id="estado"
            type='text'
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            disabled  
          />
        </div>
        <button type="submit">Crear Sesión</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default CrearSesion;
