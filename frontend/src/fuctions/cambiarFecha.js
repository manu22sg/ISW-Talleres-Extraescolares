function cambiarAsistencia(fechaISO) {
    const fecha = new Date(fechaISO); // Convertir a objeto Date
    const dia = String(fecha.getUTCDate()).padStart(2, '0'); // Obtener día (2 dígitos)
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Obtener mes (0 indexado)
    const anio = fecha.getUTCFullYear(); // Obtener año
      
    return `${dia}-${mes}-${anio}`; // Formato DD-MM-AAAA
    
}
export default cambiarAsistencia;