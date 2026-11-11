import { body, param, query } from 'express-validator';

export const idValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo').toInt(),
];

export const listQueryValidator = [
  query('apellido').optional().trim().isLength({ max: 60 }).withMessage('El apellido es demasiado largo'),
];

const fechaValida = (campo, etiqueta) =>
  body(campo)
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage(`${etiqueta} debe tener el formato AAAA-MM-DD`)
    .bail()
    .isISO8601({ strict: true, strictSeparator: true }).withMessage(`${etiqueta} no es una fecha válida`);

export const conductorValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 60 }).withMessage('El nombre es demasiado largo'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ max: 60 }).withMessage('El apellido es demasiado largo'),
  body('numero_documento')
    .trim()
    .matches(/^\d{7,8}$/).withMessage('El documento debe tener 7 u 8 dígitos, sin puntos'),
  body('numero_licencia')
    .trim()
    .notEmpty().withMessage('El número de licencia es obligatorio')
    .isLength({ max: 30 }).withMessage('El número de licencia es demasiado largo'),
  fechaValida('fecha_alta_licencia', 'La fecha de alta de la licencia'),
  fechaValida('fecha_vencimiento_licencia', 'La fecha de vencimiento de la licencia')
    .bail()
    .custom((value, { req }) => new Date(value) > new Date(req.body.fecha_alta_licencia))
    .withMessage('El vencimiento debe ser posterior a la fecha de alta'),
];