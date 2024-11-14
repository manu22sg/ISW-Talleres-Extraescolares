import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetTalleres from '@hooks/talleres/useGetTalleres';
import Table from '@components/Table';
import { deleteTaller } from '@services/taller.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { useAuth } from '@context/AuthContext';

const Talleres = () => {
  const { talleres, fetchTalleres } = useGetTalleres();
  const [dataTaller, setDataTaller] = useState(null);
  const [filterName, setFilterName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const esProfesorOEstudiante = user.rol === 'profesor' || user.rol === 'estudiante';


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
      navigate(`/talleres/editar/${dataTaller.id}`);
    }
  };

  const handleManageAlumnos = () => {
    if (dataTaller) {
      navigate(`/talleres/gestionar/${dataTaller.id}`);
    }
  };

  const handleDelete = async () => {
    if (dataTaller) {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        try {
          await deleteTaller(dataTaller.id);
          clearSelection();
          fetchTalleres();
          showSuccessAlert("¡Eliminado!", "El estado del taller ha sido cambiado exitosamente.");
        } catch (error) {
          showErrorAlert("Error", error.response.data.message);
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
          {esProfesorOEstudiante ? (
            <button onClick={handleShowDetails}>Ver Detalles</button>
          ) : (
            <>
              <button onClick={handleEdit}>Editar Taller</button>
              <button onClick={handleDelete}>Eliminar Taller</button>
              <button onClick={handleShowDetails}>Ver Detalles</button>
              <button onClick={handleManageAlumnos}>Gestionar Alumnos</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Talleres;
