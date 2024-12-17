export function fechaHoy() {
    // Crear una nueva fecha
    const fecha = new Date();

    // Obtener día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que siempre tenga 2 dígitos
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0, por eso se suma 1
    const anio = fecha.getFullYear();

    // Formato DD-MM-AAAA
    const fechaFormateada = `${dia}-${mes}-${anio}`;

    return fechaFormateada;
    
}