import { Router } from 'express';
import { login, trade } from '../controllers/authControllers.js';

const router = Router();

router.post('/login', login);
router.get('/trade', trade)

export default router;
