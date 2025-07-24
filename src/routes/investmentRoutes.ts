import express from 'express';
import { searchStocks, getStockPrice } from '../controllers/external/stockData';
import { authenticateToken } from '../middleware/auth';

const stockRoutes = express.Router();

stockRoutes.get('/stockPrice', authenticateToken, getStockPrice);
stockRoutes.get('/search', authenticateToken, searchStocks);

export default stockRoutes;