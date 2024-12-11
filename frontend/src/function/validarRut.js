export function validarRut(rut) {
    // Eliminar puntos y guión
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
    // Validar largo mínimo y que solo contenga números (excepto el dígito verificador)
    if (rutLimpio.length == 12 || !/^\d+k?$/i.test(rutLimpio)) {
      return false;
    }
  
    // Separar número y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1).toLowerCase();
  
    // Calcular el dígito verificador
    let suma = 0;
    let multiplicador = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
  
    const dvCalculado = 11 - (suma % 11);
    const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'k' : dvCalculado.toString();
  
    // Comparar el dígito verificador ingresado con el calculado
    return dvIngresado === dvEsperado;
  }