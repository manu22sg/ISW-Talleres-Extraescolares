export default function  validarRut (rut) {
    // Remover cualquier espacio, puntos y guión
    const rutSinFormato = rut.replace(/[^\dKk]/g, '').toUpperCase();
    
    // Verificar que tenga entre 8 y 9 caracteres
    if (rutSinFormato.length < 8 || rutSinFormato.length > 9) {
      return false;
    }
  
    const cuerpo = rutSinFormato.slice(0, -1); // Todos los caracteres menos el último (el dígito verificador)
    const dv = rutSinFormato.slice(-1); // Último carácter (el dígito verificador)
    
    // Validar que el dígito verificador sea válido (número o 'K')
    if (!/^[0-9Kk]$/.test(dv)) {
      return false;
    }
  
    // Validar que el cuerpo del RUT contenga solo números
    if (!/^\d+$/.test(cuerpo)) {
      return false;
    }
  
    // Algoritmo de validación del RUT
    let suma = 0;
    let multiplicador = 2;
  
    // Recorremos el RUT de derecha a izquierda
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; // Ciclo entre 2 y 7
    }
  
    // Calcular el dígito verificador esperado
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
    // Verificar si el dígito verificador coincide
    if(dv === dvCalculado){
        return true;
    }else{
        return false;
    }
  }