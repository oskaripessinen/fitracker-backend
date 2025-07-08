import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getIncomeByGroupId, createIncome, deleteIncome } from '../controllers/income';

const incomeRoutes = express.Router();

incomeRoutes.get('/:groupId', authenticateToken, getIncomeByGroupId);
incomeRoutes.post('/', authenticateToken, createIncome);
incomeRoutes.delete('/:id', authenticateToken, deleteIncome);

export default incomeRoutes;