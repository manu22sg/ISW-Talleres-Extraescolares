import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { AuthProvider } from '@context/AuthContext';

function Root() {
  return (
    <AuthProvider>
         <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Renderiza las rutas anidadas como Home y Users */}
    </>
  );
}

export default Root;
