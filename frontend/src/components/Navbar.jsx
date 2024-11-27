import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    <li>
                        <NavLink 
                            to="/home" 
                            onClick={() => setMenuOpen(false)} 
<<<<<<< HEAD
                            className={({ isActive }) => (isActive ? "active" : "")}
=======
                            activeClassName="active"
>>>>>>> guidoReal
                        >
                            Inicio
                        </NavLink>
                    </li>
                    
                    {userRole === 'administrador' && (
                        <li>
                            <NavLink 
                                to="/users" 
                                onClick={() => setMenuOpen(false)} 
<<<<<<< HEAD
                                className={({ isActive }) => (isActive ? "active" : "")}
=======
                                activeClassName="active"
>>>>>>> guidoReal
                            >
                                Usuarios
                            </NavLink>
                        </li>
                    )}
                    
                    <li>
                        <NavLink 
                            to="/talleres" 
                            onClick={() => setMenuOpen(false)} 
<<<<<<< HEAD
                            className={({ isActive }) => (isActive ? "active" : "")}
=======
                            activeClassName="active"
>>>>>>> guidoReal
                        >
                            Talleres
                        </NavLink>
                    </li>
<<<<<<< HEAD

                    {userRole === 'profesor' && (
                        <li>
                            <NavLink 
                                to="/crear-sesion" 
                                onClick={() => setMenuOpen(false)} 
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Crear Sesión
                            </NavLink>
                        </li>
                    )}

=======
                    
>>>>>>> guidoReal
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
