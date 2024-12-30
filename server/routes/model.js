import { Router } from 'express';
// import { protect } from '../middleware/authProtect';
import { GenerateResults } from '../controllers/model.js';

const router = Router();

/* CRUD POST*/
router.post('/generate',GenerateResults);

export default router;
