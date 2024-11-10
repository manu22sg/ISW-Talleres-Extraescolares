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
        <Link to="/mis-talleres">Mis Talleres (para profesores)</Link>
      </nav>
    </div>
  );
};

export default Home;
