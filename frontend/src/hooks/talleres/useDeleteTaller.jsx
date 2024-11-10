import { useCallback } from 'react';
import { deleteTaller } from '@services/taller.service';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert';

const useDeleteTaller = (fetchTalleres, setDataTaller) => {
  const handleDelete = useCallback(async (taller) => {
    if (!taller || !taller.id) {
      console.error('No se ha seleccionado un taller para eliminar.');
      showErrorAlert('Error', 'No se ha seleccionado un taller para eliminar.');
      return;
    }
    try {
      await deleteTaller(taller.id);
      showSuccessAlert('¡Eliminado!', 'El taller ha sido eliminado correctamente.');
      setDataTaller(null);  // Limpia la selección después de la eliminación
      fetchTalleres();  // Actualiza la lista de talleres
    } catch (error) {
      console.error('Error al eliminar el taller:', error);
      showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el taller.');
    }
  }, [fetchTalleres, setDataTaller]);

  return {
    handleDelete,
  };
};

export default useDeleteTaller;
