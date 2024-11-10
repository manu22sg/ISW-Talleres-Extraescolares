import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Talleres from '@pages/Talleres';
import EditTaller from '@pages/EditTaller'; // Ajusta la ruta si es necesario
import TallerDetails from '@pages/TallerDetails';
import ManageAlumnos from '@pages/ManageAlumnos'; 

import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        ),
    },{
      path: '/talleres', // Ruta para la página de Talleres
      element: <Talleres />
    },
    {
      path: '/talleres/editar/:id', // Ruta para editar un taller
      element: <EditTaller />
    },
    {
      path: '/talleres/detalles/:id',
      element: <TallerDetails/> // Ruta para ver los detalles de un taller
    },
    { path: '/talleres/gestionar/:id', 
      element: <ManageAlumnos /> } // Ruta para gestionar los alumnos de un taller
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)