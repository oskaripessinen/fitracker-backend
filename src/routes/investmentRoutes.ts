import express from 'express';
import { searchStocks, getStockPrice } from '../controllers/external/stockData';
import { createInvestment, getInvestmentsWithGroupId } from '../controllers/investment';
import { authenticateToken } from '../middleware/auth';

const investmentkRoutes = express.Router();

investmentkRoutes.get('/stockPrice', authenticateToken, getStockPrice);
investmentkRoutes.get('/search', authenticateToken, searchStocks);
investmentkRoutes.post('/', authenticateToken, createInvestment);
investmentkRoutes.get('/:groupId', authenticateToken, getInvestmentsWithGroupId);

export default investmentkRoutes;