import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { searchStocks } from '../controllers/external/stockData';

const investmentRoutes = express.Router();

investmentRoutes.get('/search', authenticateToken, searchStocks);

export default investmentRoutes;