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
    .pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/) // Permitir números y letras
    .messages({
      "string.empty": "El nombre del taller no puede estar vacío.",
      "string.base": "El nombre del taller debe ser de tipo string.",
      "string.min": "El nombre del taller debe tener como mínimo 10 caracteres.",
      "string.max": "El nombre del taller debe tener como máximo 100 caracteres.",
      "string.pattern.base": "El nombre del taller solo puede contener letras, números y espacios.",
    }),
  descripcion: Joi.string()
    .min(15)
    .max(150)
    .messages({
      "string.empty": "La descripción del taller no puede estar vacía.",
      "string.base": "La descripción del taller debe ser de tipo string.",
      "string.min": "La descripción del taller debe tener como mínimo 15 caracteres.",
      "string.max": "La descripción del taller debe tener como máximo 150 caracteres.",
    }),
  capacidad: Joi.number()
    .integer()
    .positive()
    .less(50)
    .messages({
      "number.base": "La capacidad debe ser un número.",
      "number.positive": "La capacidad debe ser mayor a 0.",
      "number.integer": "La capacidad debe ser un número entero.",
      "number.less" : "La capacidad debe ser menor a 50."
    }),
  fecha_inicio: Joi.string() // Cadena para el formato 'DD/MM/YYYY'
    .custom(validateDate)
    .required()
    .messages({
      "any.invalid": "La fecha de inicio debe ser válida y en formato 'DD/MM/YYYY'.",
      "any.required": "La fecha de inicio es obligatoria.",
    }),
  fecha_fin: Joi.string() // Cadena para el formato 'DD/MM/YYYY'
    .custom(validateDate)
    .required()
    .messages({
      "any.invalid": "La fecha de fin debe ser válida y en formato 'DD/MM/YYYY'.",
      "any.required": "La fecha de fin es obligatoria.",
    }),
  estado: Joi.string().valid('pendiente', 'enCurso', 'finalizado', 'eliminado').required(),
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

    if (fechaFin.isBefore(fechaInicio)) {
      return helpers.error("any.invalid"); // No pasar el mensaje aquí
    }

    return value;
  })
  .messages({
    "any.invalid": "La fecha de fin debe ser mayor a la fecha de inicio.", // Mensaje personalizado
  })
  .unknown(false);



  export const tallerPatchValidation = tallerBodyValidation.fork( // Extender la validación de tallerBodyValidation para PATCH
    ['nombre', 'descripcion', 'capacidad', 'fecha_inicio', 'fecha_fin', 'estado', 'profesorId'], 
    (schema) => schema.optional()
  );
  