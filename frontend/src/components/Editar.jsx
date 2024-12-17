import { useState } from "react";
import axios from '../services/root.service';
import { showSuccessAlert } from '../helpers/sweetAlert.js';

const Editar = ({ cerrarModal, Estudiantes , taller, sesion}) => {
  
  const [comentarios, setComentarios] = useState(Estudiantes.comentarios);
  const [estado, setEstado] = useState(Estudiantes.estado);
  
  // editar asistencia
  const handleSet = async () => {
    //llamar a la funcion que edita la asistencia
    try {
      const response = await axios.patch(`/asistencia/talleres/${taller}/sesiones/${sesion}/usuarios/${Estudiantes.id}/asistencia`, {
        nuevoEstado: estado,
        comentarios: comentarios,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    showSuccessAlert('Asistencia editada correctamente');
    cerrarModal();
  }
  //editar estado presente o ausente
  return (
    <div style={modalStyles}>
      <div className="modal-content">
        <span className="close" onClick={cerrarModal}>x</span>
        <h2>Editar Estudiante</h2>
        <input placeholder={Estudiantes.nombreCompleto} disabled />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
        </select>
        <input type="textarea" value={comentarios} onChange={(e)=>setComentarios(e.target.value)}  />
        <button onClick={handleSet}>Guardar</button>
      </div>
    </div>
  );
};

export default Editar;
  
  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      maxWidth: "400px",
      width: "100%",
    },
  };
