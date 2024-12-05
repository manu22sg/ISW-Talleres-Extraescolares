import Swal from 'sweetalert2';

export async function deleteDataAlert({ title, text, confirmButtonText }) {
  return Swal.fire({
    title: title || "¿Estás seguro?",
    text: text || "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText || "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
}
export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'success'
  );
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'error'
  );
};