import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetTalleres from '@hooks/talleres/useGetTalleres';
import Table from '@components/Table';
import { deleteTaller } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';


const Talleres = () => {
  const { talleres, fetchTalleres } = useGetTalleres();
  const [dataTaller, setDataTaller] = useState(null);
  const [filterName, setFilterName] = useState('');

  const navigate = useNavigate();

  const talleresConProfesorId = useMemo(() => 
    talleres.map(taller => ({
      ...taller,
      profesorId: taller.profesor.id,
    })),
    [talleres]
  );
  const filteredTalleres = useMemo(() => {
    return talleresConProfesorId.filter(taller =>
      taller.nombre.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [talleresConProfesorId, filterName]);

  const columns = [
    { title: "ID", field: "id" },
    { title: "Nombre", field: "nombre" },
    { title: "Descripción", field: "descripcion" },
    { title: "Estado", field: "estado" },
    { title: "Profesor ID", field: "profesorId" },
    { title: "Inscritos", field: "inscritos" }
  ];
  const handleShowDetails = () => {
    if (dataTaller) {
      navigate(`/talleres/detalles/${dataTaller.id}`);
    }
  };
  const handleNameFilterChange = (e) => {
    setFilterName(e.target.value);
  };


  const handleSelectionChange = (selectedData) => {
    setDataTaller(selectedData || null);
  };

  const clearSelection = () => {
    setDataTaller(null);
  };

  const handleEdit = () => {
    if (dataTaller) {
      // Redirigir a la página de edición con el ID del taller seleccionado
      navigate(`/talleres/editar/${dataTaller.id}`);
    }
  };

  const handleDelete = async () => {
    if (dataTaller) {
      // Muestra la alerta de confirmación
      const result = await deleteDataAlert();
  
      if (result.isConfirmed) {
        try {
          await deleteTaller(dataTaller.id);
          clearSelection();
          fetchTalleres();
          
          // Muestra alerta de éxito
          showSuccessAlert("¡Eliminado!", "El estado del taller ha sido cambiado exitosamente.");
        } catch (error) {
          
          showErrorAlert("Error", error.response.data.message); // Muestra alerta de error
        }
      }
    }
  };
  

  useEffect(() => {
    fetchTalleres();
  }, []);

  return (
    <div>
      <h1>Lista de Talleres</h1>
      <input
        type="text"
        placeholder="Filtrar por nombre"
        value={filterName}
        onChange={handleNameFilterChange}
      />
      <Table
        data={filteredTalleres}
        columns={columns}
        onSelectionChange={handleSelectionChange}
      />

      {dataTaller && (
        <div>
          <button onClick={handleEdit}>Editar Taller</button>
          <button onClick={handleDelete}>Eliminar Taller</button>
          <button onClick={handleShowDetails}>Ver Detalles</button>
        </div>
      )}
    </div>
  );
};


export default Talleres;
