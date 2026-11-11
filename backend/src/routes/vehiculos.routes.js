import { Router } from 'express';
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/vehiculos.controller.js';
import { idValidator, listQueryValidator, vehiculoValidator } from '../validators/vehiculos.validators.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listQueryValidator, validate, listar);
router.get('/:id', idValidator, validate, obtener);
router.post('/', vehiculoValidator, validate, crear);
router.put('/:id', idValidator, vehiculoValidator, validate, actualizar);
router.delete('/:id', idValidator, validate, eliminar);

export default router;