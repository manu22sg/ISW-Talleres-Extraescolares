import { useEffect, useState } from "react";
import { tallerinscritos } from "@services/report.service";

const useGetTaller = () => {

    const [talleres, setTalleres] = useState([]);

    const fetchTalleres = async () => {
        try {
          const data = await tallerinscritos();
          setTalleres(data);
        } catch (error) {
          console.error('Error al obtener los talleres:', error);
        }
      };

    useEffect(() => {
        fetchTalleres();
    },);

    return {talleres, fetchTalleres, setTalleres}
}

export default useGetTaller;