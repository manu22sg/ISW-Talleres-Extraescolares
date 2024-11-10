// hooks/talleres/useEditTaller.js
import { useState } from 'react';
import { updateTaller } from '@services/taller.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditTaller = (setTalleres) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataTaller, setDataTaller] = useState(null);
  
    const handleClickUpdate = () => {
      if (dataTaller) {
        setIsPopupOpen(true);
      } else {
        console.error('No se ha seleccionado un taller para actualizar.');
      }
    };
  
    const handleUpdate = async (updatedTallerData) => {
      if (updatedTallerData && dataTaller) {
        try {
          const updatedTaller = await updateTaller(updatedTallerData, dataTaller.id);
          showSuccessAlert('¡Actualizado!', 'El taller ha sido actualizado correctamente.');
          setIsPopupOpen(false);
  
          setTalleres(prevTalleres => prevTalleres.map(taller => 
            taller.id === updatedTaller.id ? updatedTaller : taller
          ));
  
          setDataTaller(null); // Limpia la selección después de la actualización
        } catch (error) {
          console.error('Error al actualizar el taller:', error);
          showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el taller.');
        }
      }
    };
  
    return {
      handleClickUpdate,
      handleUpdate,
      isPopupOpen,
      setIsPopupOpen,
      dataTaller,
      setDataTaller
    };
  };
  
export default useEditTaller;
