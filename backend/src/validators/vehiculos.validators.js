import { body, param, query } from 'express-validator';

export const idValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt(),
];

export const listQueryValidator = [
  query('marca').optional().trim().isLength({ max: 60 }).withMessage('La marca es demasiado larga'),
];

const anioMaximo = new Date().getFullYear() + 1;

export const vehiculoValidator = [
  body('marca')
    .trim()
    .notEmpty().withMessage('La marca es obligatoria')
    .isLength({ max: 60 }).withMessage('La marca es demasiado larga'),
  body('modelo')
    .trim()
    .notEmpty().withMessage('El modelo es obligatorio')
    .isLength({ max: 60 }).withMessage('El modelo es demasiado largo'),
  body('patente')
    .trim()
    .customSanitizer((v) => String(v).replace(/[\s-]/g, '').toUpperCase())
    .matches(/^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$/)
    .withMessage('Patente inválida (ejemplos: ABC123 o AB123CD)'),
  body('anio')
    .isInt({ min: 1950, max: anioMaximo })
    .withMessage(`El año debe estar entre 1950 y ${anioMaximo}`)
    .toInt(),
  body('capacidad_carga')
    .isFloat({ gt: 0 })
    .withMessage('La capacidad de carga debe ser un número mayor a 0')
    .toFloat(),
];