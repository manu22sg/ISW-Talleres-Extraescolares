import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import '@styles/Home.css'; 

const Home = () => {
  const { user } = useAuth(); 
  const esAdministrador = user?.rol === 'administrador';
  const esProfesor = user?.rol === 'profesor';
  const esEstudiante = user?.rol === 'estudiante';


  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a la Plataforma de Talleres</h1>
      <p className="home-subtitle">Elige una opción con tu rol de: {user?.rol}</p>
      <nav className="home-nav">
        <Link className="home-link" to="/talleres">Ver Todos los Talleres</Link>

        {esAdministrador && (
          <>
            <Link className="home-link" to="/CreateTaller">Crear Taller</Link>
            <Link className="home-link" to="/Report">Report</Link>
            <Link className="home-link" to="/ListadeEspera">Ver Lista de espera</Link>
          </>
        )}

        {esProfesor && (
          
          
          <>
            <Link className="home-link" to="/mis-talleres/profesor">Mis Talleres</Link>
            <Link className="home-link" to="/crear-sesion">Crear Sesión</Link>
            <Link className="home-link" to="/Registrar-asistencia">Registrar Asistencia</Link>
            <Link className="home-link" to="/Ver-inscritos">Ver Inscritos</Link>



          </>
        )}
        {esEstudiante && (
          <Link className="home-link" to="/mis-talleres/Estudiante">Mis Talleres</Link>
        )}
      </nav>
    </div>
  );
};

export default Home;
