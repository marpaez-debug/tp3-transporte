import { body, param, query } from 'express-validator';

export const idValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt(),
];

export const listQueryValidator = [
  query('vehiculo_id').optional().isInt({ min: 1 }).withMessage('vehiculo_id debe ser un entero positivo').toInt(),
  query('conductor_id').optional().isInt({ min: 1 }).withMessage('conductor_id debe ser un entero positivo').toInt(),
];

const aDate = (s) => new Date(String(s).replace(' ', 'T'));

// Acepta "AAAA-MM-DD HH:mm" o "AAAA-MM-DDTHH:mm" (con o sin segundos)
const fechaHora = (campo, etiqueta) =>
  body(campo)
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/)
    .withMessage(`${etiqueta} debe tener el formato AAAA-MM-DD HH:mm`)
    .bail()
    .customSanitizer((v) => {
      const s = v.replace(' ', 'T');
      return s.length === 16 ? `${s}:00` : s;
    })
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage(`${etiqueta} no es una fecha válida`)
    .customSanitizer((v) => v.replace('T', ' '));

export const viajeValidator = [
  body('vehiculo_id')
    .isInt({ min: 1 }).withMessage('vehiculo_id debe ser un entero positivo')
    .toInt(),
  body('conductor_id')
    .isInt({ min: 1 }).withMessage('conductor_id debe ser un entero positivo')
    .toInt(),
  fechaHora('fecha_salida', 'La fecha de salida'),
  fechaHora('fecha_llegada', 'La fecha de llegada')
    .bail()
    .custom((value, { req }) => {
      const salida = aDate(req.body.fecha_salida);
      return Number.isNaN(salida.getTime()) || aDate(value) >= salida;
    })
    .withMessage('La fecha de llegada no puede ser anterior a la de salida'),
  body('origen')
    .trim()
    .notEmpty().withMessage('El origen es obligatorio')
    .isLength({ max: 100 }).withMessage('El origen es demasiado largo'),
  body('destino')
    .trim()
    .notEmpty().withMessage('El destino es obligatorio')
    .isLength({ max: 100 }).withMessage('El destino es demasiado largo'),
  body('kilometros')
    .isFloat({ gt: 0 }).withMessage('Los kilómetros deben ser un número mayor a 0')
    .toFloat(),
  body('observaciones')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Las observaciones son demasiado largas'),
];