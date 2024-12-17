"use strict";
import Joi from "joi";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat); // Extiende dayjs para permitir formatos de fecha personalizados

// Función para validar el formato 'DD/MM/YYYY' usando dayjs
const validateDate = (value, helpers) => {
  const parsedDate = dayjs(value, 'DD/MM/YYYY', true); // Forzamos el formato exacto 'DD/MM/YYYY'

  if (!parsedDate.isValid()) {
    return helpers.error('any.invalid'); // Error si la fecha no es válida
  }

  return value; // Retornamos la cadena original si es válida
};

export const tallerBodyValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  nombre: Joi.string()
    .min(10)
    .max(100)
    .pattern(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre del taller no puede estar vacío.",
      "string.base": "El nombre del taller debe ser de tipo texto.",
      "string.min": "El nombre del taller debe tener como mínimo 10 caracteres.",
      "string.max": "El nombre del taller debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del taller solo puede contener letras y un solo espacio entre palabras.",
    }),

  descripcion: Joi.string()
    .min(15)
    .max(150)
    .pattern(/^(?!.*\s{2})[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "La descripción del taller no puede estar vacía.",
      "string.base": "La descripción del taller debe ser de tipo texto.",
      "string.min": "La descripción del taller debe tener como mínimo 15 caracteres.",
      "string.max": "La descripción del taller debe tener como máximo 150 caracteres.",
      "string.pattern.base": "La descripción del taller solo puede contener letras y un solo espacio entre palabras.",
    }),
    capacidad: Joi.number()
    .integer()
    .positive()
    .required()
    .less(50)
    .empty("")
    .messages({
      "number.base": "La capacidad debe ser un número no decimal mayor a 0.",
      "number.positive": "La capacidad debe ser mayor a 0.",
      "number.integer": "La capacidad debe ser un número entero.",
      "number.less": "La capacidad debe ser menor a 50.",
      "any.required": "La capacidad es obligatoria.", // Aparece cuando el campo está ausente o vacío
       // Aparece cuando el campo está vacío
    }),

  fecha_inicio: Joi.string() // Cadena para el formato 'DD/MM/YYYY'
    .custom(validateDate)
    .required()
    .messages({
      "string.empty": "La fecha de inicio no puede estar vacía.",
      "any.invalid": "La fecha de inicio debe ser válida, en formato 'DD/MM/YYYY'",
      "any.required": "La fecha de inicio es obligatoria.",
    }),
  fecha_fin: Joi.string() // Cadena para el formato 'DD/MM/YYYY'
    .custom(validateDate)
    .required()
    .messages({
      "string.empty": "La fecha de fin no puede estar vacía.",
      "any.invalid": "La fecha de fin debe ser válida, en formato 'DD/MM/YYYY', y no puede ser anterior a la fecha de inicio.",
      "any.required": "La fecha de fin es obligatoria.",
    }),
    estado: Joi.string()
    .valid('pendiente', 'enCurso', 'finalizado', 'eliminado')
    .required()
    .empty("")
    .messages({
      "any.only": "El estado debe ser uno de los siguientes valores: 'pendiente', 'enCurso', 'finalizado', 'eliminado'.",
      "any.required": "El estado es obligatorio."
    }),
  
  profesorId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
})
.custom((value, helpers) => {
  const { fecha_inicio, fecha_fin } = value;

  const fechaInicio = dayjs(fecha_inicio, 'DD/MM/YYYY', true);
  const fechaFin = dayjs(fecha_fin, 'DD/MM/YYYY', true);
  const fechaActual = dayjs().startOf('day'); // Fecha actual sin hora

  // Validar que fecha_inicio no sea anterior a la fecha actual
  if (fechaInicio.isBefore(fechaActual)) {
    return helpers.message("La fecha de inicio no puede ser anterior a la fecha actual."); // Mensaje específico
  }

  // Validar que fecha_fin no sea anterior a fecha_inicio
  if (fechaFin.isBefore(fechaInicio)) {
    return helpers.message("La fecha de fin debe ser mayor o igual a la fecha de inicio."); // Mensaje específico
  }

  return value;
})
.messages({
  "any.invalid": "La validación de fechas falló. Verifica los valores ingresados.", // Este solo aparecerá si no hay mensajes específicos.
});

export const tallerPatchValidation = tallerBodyValidation.fork(
  ['nombre', 'descripcion', 'capacidad', 'fecha_inicio', 'fecha_fin', 'estado', 'profesorId'],
  (schema) => schema.optional()
);
