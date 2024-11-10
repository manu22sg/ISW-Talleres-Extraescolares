// hooks/talleres/useGetTalleres.js
import { useEffect, useState } from 'react';
import { getTalleres } from '@services/taller.service';

const useGetTalleres = () => {
  const [talleres, setTalleres] = useState([]);

  const fetchTalleres = async () => {
    try {
      const data = await getTalleres();
      setTalleres(data);
    } catch (error) {
      console.error('Error al obtener los talleres:', error);
    }
  };

  useEffect(() => {
    fetchTalleres();
  }, []);

  return { talleres, fetchTalleres, setTalleres };
};

export default useGetTalleres;
