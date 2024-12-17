import { useState, useEffect } from "react"
import axios from '../services/root.service';
import '../styles/verInscritosAlumnos.css';
import cambiarFecha from '../fuctions/cambiarFecha.js';

const VerAsistencia = () => {
    const [asistencia, setAsistencia] = useState([])

    useEffect(() => {
        handleAsistencia()
    }, [])

    const handleAsistencia = async () => {
        //console.log('Asistencia')
        try {
            const response = await axios.get(`/asistencia/mis-sesiones`);
            console.log(response);
            setAsistencia(response.data.asistencias);
          } catch (error) {
            console.log(error);
          }

    }

    return(
        <div className="margen">
            <h1>Ver Asistencia</h1>
            {(
                <table className="asistencia-table">
                <thead>
                    <tr>
                        <th>Sesion</th>
                        <th>Taller</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {asistencia.map((item) => (
                    <tr key={item.id}>
                        <td>{item.sesionId}</td>
                        <td>{item.taller.nombre}</td>
                        <td>{cambiarFecha(item.createdAt)}</td>
                        <td>{item.estado}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            <button className='btn' onClick={handleAsistencia}>Actualizar</button>
        </div>
    )
}

export default VerAsistencia;