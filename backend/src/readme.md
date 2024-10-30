
Sistema de Toma de Asistencia
Este módulo permite al profesor registrar la asistencia de los estudiantes al inicio de cada sesión de un taller, así como consultar el historial de asistencia. Incluye funcionalidades para registrar, actualizar y finalizar sesiones de asistencia.

Requerimientos Previos
Para utilizar el módulo de asistencia es necesario:

Tener un servidor Node.js configurado.
Tener una base de datos PostgreSQL conectada y configurada con las tablas necesarias (asistencias, sesiones, talleres, users).
Tener configurado un sistema de autenticación (JWT) y el middleware authenticateJwt para proteger las rutas.
Configuración de la Base de Datos
Asegúrate de tener las siguientes tablas y relaciones configuradas en tu base de datos para que el módulo funcione correctamente:

Tabla users: contiene los datos de los usuarios (profesores y estudiantes).
Tabla talleres: contiene información de los talleres.
Tabla sesiones: contiene la información de las sesiones de cada taller.
Tabla asistencias: registra la asistencia de los estudiantes para cada sesión.
Endpoints de la API

1. Registrar Asistencia
Permite al profesor registrar o actualizar la asistencia de un estudiante en una sesión.

Endpoint: POST /api/asistencia/:sesion_id/registrar

Headers:

Authorization: Token JWT del profesor.
Body:

json


{
  "estudiante_id": 1,
  "estado": "presente",
  "comentarios": "Llegó a tiempo"
}
Respuesta Exitosa:

json


{
  "status": "Success",
  "message": "Asistencia registrada exitosamente.",
  "data": {
    "id": 1,
    "sesion_id": 9,
    "estudiante_id": 1,
    "estado": "presente",
    "comentarios": "Llegó a tiempo",
    "createdAt": "2024-10-30T00:00:00.000Z",
    "updatedAt": "2024-10-30T00:00:00.000Z"
  }
}
2. Obtener Lista de Asistencia de una Sesión
Permite al profesor obtener la lista de asistencia de todos los estudiantes en una sesión específica.

Endpoint: GET /api/asistencia/:sesion_id/asistencia

Headers:

Authorization: Token JWT del profesor.
Respuesta Exitosa:

json


{
  "status": "Success",
  "message": "Asistencia obtenida exitosamente.",
  "data": [
    {
      "id": 1,
      "sesion_id": 9,
      "estudiante_id": 1,
      "estado": "presente",
      "comentarios": "Llegó a tiempo"
    },
    {
      "id": 2,
      "sesion_id": 9,
      "estudiante_id": 2,
      "estado": "ausente",
      "comentarios": "Faltó sin justificación"
    }
  ]
}
3. Finalizar una Sesión
Permite al profesor finalizar una sesión para evitar cambios posteriores en la asistencia.

Endpoint: POST /api/asistencia/:sesion_id/finalizar

Headers:

Authorization: Token JWT del profesor.
Respuesta Exitosa:

json


{
  "status": "Success",
  "message": "La sesión ha sido finalizada.",
  "data": {
    "id": 9,
    "estado": "finalizada",
    "updatedAt": "2024-10-30T00:00:00.000Z"
  }
}

4. Obtener Historial de Asistencia de un Estudiante
Permite a los estudiantes ver su historial de asistencia o a los profesores ver el historial de un estudiante específico.

Endpoint: GET /api/asistencia/estudiante/:estudiante_id/historial

Headers:

Authorization: Token JWT (profesor o estudiante).
Respuesta Exitosa:

json

{
  "status": "Success",
  "message": "Historial de asistencia obtenido exitosamente.",
  "data": [
    {
      "sesion_id": 9,
      "estado": "presente",
      "comentarios": "Llegó a tiempo",
      "createdAt": "2024-10-30T00:00:00.000Z"
    },
    {
      "sesion_id": 10,
      "estado": "ausente",
      "comentarios": "Faltó sin justificación",
      "createdAt": "2024-10-31T00:00:00.000Z"
    }
  ]
}
Ejemplo de Prueba con Thunder Client
Registrar Asistencia:

Método: POST
URL: http://localhost:3000/api/asistencia/:sesion_id/registrar
Headers:
Authorization: Bearer token
Body:
json

{
  "estudiante_id": 1,
  "estado": "presente",
  "comentarios": "Llegó a tiempo"
}
Obtener Lista de Asistencia:

Método: GET
URL: http://localhost:3000/api/asistencia/:sesion_id/asistencia
Headers:
Authorization: Bearer token
Finalizar una Sesión:

Método: POST
URL: http://localhost:3000/api/asistencia/:sesion_id/finalizar
Headers:
Authorization: Bearer token
Obtener Historial de Asistencia de un Estudiante:

Método: GET
URL: http://localhost:3000/api/asistencia/estudiante/:estudiante_id/historial
Headers:
Authorization: Bearer token
Notas
Roles y Permisos: Asegúrate de que el rol del usuario (profesor o estudiante) está correctamente validado para cada endpoint.
Estados de la Asistencia: Los valores del campo estado para asistencia pueden ser presente, ausente, etc., según los requerimientos de la aplicación.
Finalización de Sesión: Una vez finalizada la sesión, no se permitirán más cambios en la asistencia de esa sesión.