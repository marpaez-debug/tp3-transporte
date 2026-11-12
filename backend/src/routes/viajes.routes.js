import { Router } from 'express';
import {
  listar, obtener, crear, actualizar, eliminar,
  historialVehiculo, historialConductor,
} from '../controllers/viajes.controller.js';
import { idValidator, listQueryValidator, viajeValidator } from '../validators/viajes.validators.js';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/vehiculo/:id', idValidator, validate, historialVehiculo);
router.get('/conductor/:id', idValidator, validate, historialConductor);

router.get('/', listQueryValidator, validate, listar);
router.get('/:id', idValidator, validate, obtener);
router.post('/', viajeValidator, validate, crear);
router.put('/:id', idValidator, viajeValidator, validate, actualizar);
router.delete('/:id', idValidator, validate, eliminar);

export default router;