import { useState } from "react";
import axios from '../services/root.service';
import { showSuccessAlert } from '../helpers/sweetAlert.js';
import '../styles/Editar.css';

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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={cerrarModal}>x</span>
        <h2>Editar Estudiante</h2>
        <input placeholder={Estudiantes.nombreCompleto} disabled  className="input-field"/>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="select-field"
        >
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
        </select>
        <textarea type="textarea" value={comentarios} onChange={(e)=>setComentarios(e.target.value)} className="textarea-field"  />
        <button onClick={handleSet} className="save-button">Guardar</button>
      </div>
    </div>
  );
};

export default Editar;