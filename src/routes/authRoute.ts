import express from 'express';
import { validateToken } from '../controllers/auth';

const authRoutes = express.Router();

authRoutes.post('/validate', validateToken);

export default authRoutes;