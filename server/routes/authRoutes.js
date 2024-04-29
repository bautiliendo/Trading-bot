import { Router } from 'express';
import { caucion, login, trade } from '../controllers/authControllers.js';

const router = Router();

router.post('/login', login);
router.get('/trade', trade);
router.get('/caucion', caucion);

export default router;
