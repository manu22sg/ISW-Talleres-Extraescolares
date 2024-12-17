import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
//import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Talleres from '@pages/Talleres';
import EditTaller from '@pages/EditTaller'; // Ajusta la ruta si es necesario
import TallerDetails from '@pages/TallerDetails';
import ManageAlumnos from '@pages/ManageAlumnos';
import VerTalleresProfesor from '@pages/VerTalleresProfesor'; 
import TalleresEstudiante from '@pages/VerTalleresEstudiante';
import CreateTaller from '@pages/CreateTaller';

import Report from '@pages/Report';
import ReportPrincipal from '@pages/ReportPrincipal';
import ReportAlumno from '@pages/ReportAlumno';
import RepCanInscritos from '@pages/RepCanInscritos';
import RepAsistencia from '@pages/RepAsistencia';
import RepEstado from '@pages/RepEstado';
import RepTalleresProfesor from '@pages/RepTalleresProfesor';
import RepProfesor from '@pages/RepProfesor';

import ProtectedRoute from '@components/ProtectedRoute';
import CrearSesion from './pages/CrearSesion'; 
import RegistrarAsistencia from '@pages/RegistrarAsistencia';
import VerInscritos from '@pages/VerInscritos';
import RegistrarAsistenciaToken from "@pages/RegistrarAsistenciaToken"; // Importa el nuevo componente
import UpdateAsistencia from "@pages/updateAsistencia";
import VerAsistencia from '@pages/VerAsistencia';
import '@styles/styles.css';
import Espera from '@pages/ListaEspera';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    //errorElement: <Error404/>,
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
        element:( 
          <ProtectedRoute allowedRoles={['administrador']}>
            <EditTaller />
          </ProtectedRoute>
          )
      },
      {
        path: '/talleres/detalles/:id',
        element: <TallerDetails/> // Ruta para ver los detalles de un taller
      },
      { path: '/talleres/gestionar/:id', 
        element: (<ProtectedRoute allowedRoles={['administrador']}>
        <ManageAlumnos />
        </ProtectedRoute>
        ),},
        {path: '/mis-talleres/Profesor',
          element: <VerTalleresProfesor/>
        },
        {path: '/mis-talleres/Estudiante',
          element: <TalleresEstudiante/>
        },
        {
          path: '/CreateTaller',
          element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <CreateTaller />
            </ProtectedRoute>)
        },
        {
          path: '/report',
          element: (            
            <ProtectedRoute allowedRoles={['administrador']}>
              <Report />
            </ProtectedRoute>)
            
        },
        {
          path: '/ReportPrincipal',
          element:(
            <ReportPrincipal/>
          )
        },
        {
          path: '/ReportAlumno',
          element:(
              <ReportAlumno/>
          )
        },
        {
          path: '/RepCanInscritos',
          element:(
              <RepCanInscritos/>
          )
        },
        {
          path: '/RepAsistencia',
          element:(
              <RepAsistencia/>
          )
        },
        {
          path: '/RepEstado',
          element:(
              <RepEstado/>
          )
        },
        {
          path: '/RepTalleresProfesor',
          element:(
              <RepTalleresProfesor/>  
          )
        },
        {
          path: '/RepProfesor',
          element:(
              <RepProfesor/>
          )
        },

        {path: '/crear-sesion',
        element: <CrearSesion/>
        
        },
        {
          path: '/registrar-asistencia',
          element: (
            <ProtectedRoute allowedRoles={['profesor']}>
              <RegistrarAsistencia />
            </ProtectedRoute>
          ),
        },
        {
        path : 'Ver-inscritos',
        element: <VerInscritos/>
        },
        {
          path : 'Mis-inscritos',
          element: <VerAsistencia/>
          },
        {
          path: "/registrar-asistencia-token",
          element: <RegistrarAsistenciaToken />,
        },
        {
          path: "/update-asistencia",
          element: <UpdateAsistencia/>
        },{
          path: '/ListadeEspera',
          element: <Espera/>
        },
       
    
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