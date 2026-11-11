import { Router } from 'express';
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/conductores.controller.js';
import { idValidator, listQueryValidator, conductorValidator } from '../validators/conductores.validators.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listQueryValidator, validate, listar);
router.get('/:id', idValidator, validate, obtener);
router.post('/', conductorValidator, validate, crear);
router.put('/:id', idValidator, conductorValidator, validate, actualizar);
router.delete('/:id', idValidator, validate, eliminar);

export default router;