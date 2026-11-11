import { body } from 'express-validator';

export const registerValidator = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre es demasiado largo'),
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .toLowerCase(),
  body('contrasena')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .toLowerCase(),
  body('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria'),
];