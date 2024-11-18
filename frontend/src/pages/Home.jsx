import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la Plataforma de Talleres</h1>
      <p>Elige una opción:</p>
      <nav>
        <Link to="/talleres">Ver Todos los Talleres</Link>
        <br />
        <Link to="/mis-talleres/Profesor">Mis Talleres (para profesores)</Link>
        <br />
        <Link to="/mis-talleres/Estudiante">Mis Talleres (para Alumnos)</Link>
        <br />
        <Link to="/CreateTaller">Crear Taller</Link>
      </nav>
    </div>
  );
};

export default Home;
