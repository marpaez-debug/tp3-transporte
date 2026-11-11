import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

export default router;