import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import '@styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  const esAdministrador = user?.rol === 'administrador';
  const esProfesor = user?.rol === 'profesor';
  const esEstudiante = user?.rol === 'estudiante';

  // Personalizamos el mensaje según el rol
  let mensajeRol;
  if (esAdministrador) {
    mensajeRol = "Ver todos los talleres";
  } else if (esProfesor) {
    mensajeRol = "Ver talleres";
  } else if (esEstudiante) {
    mensajeRol = "Inscribir talleres";
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a la Plataforma de Talleres</h1>
      <p className="home-subtitle">Elige una opción con tu rol de: {user?.rol}</p>
      
      
      <nav className="home-nav">
        {/* link común para todos */}
        <Link className="home-link" to="/talleres">{mensajeRol}</Link>

        {esAdministrador && (
          <>
            <Link className="home-link" to="/CreateTaller">Crear Taller</Link>
            <Link className="home-link" to="/Report">Reportes</Link>
            <Link className="home-link" to="/ListadeEspera">Ver Lista de espera</Link>
          </>
        )}

        {esProfesor && (
<<<<<<< HEAD
<<<<<<< HEAD
          
          
=======
>>>>>>> e7b3268a02aab0967c4bcbb88bb1ca21b7bc191b
          <>
            <Link className="home-link" to="/mis-talleres/profesor">Mis Talleres</Link>
            <Link className="home-link" to="/crear-sesion">Crear Sesión</Link>
            <Link className="home-link" to="/Registrar-asistencia">Registrar Asistencia</Link>
            <Link className="home-link" to="/Ver-inscritos">Ver Inscritos</Link>
          </>
        )}
<<<<<<< HEAD
=======
          <Link className="home-link" to="/mis-talleres/Profesor">Mis Talleres</Link>
=======

        {esEstudiante && (
          <Link className="home-link" to="/mis-talleres/Estudiante">Mis Talleres</Link>
>>>>>>> e7b3268a02aab0967c4bcbb88bb1ca21b7bc191b
        )}
      
>>>>>>> 9e70b9a57ff692849f48a8ad86422d1488ff508a
        {esEstudiante && (
          <>
        
          <Link className="home-link" to="/mis-talleres/Estudiante">Mis Talleres</Link>
          <Link className="home-link" to="/ListadeEspera">Ver Lista de espera</Link>
          </>
        )}


      </nav>
    </div>
  );
};

export default Home;
