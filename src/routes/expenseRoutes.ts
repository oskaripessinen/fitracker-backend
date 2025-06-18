import express from "express";
import { authenticateToken } from "../middleware/auth";
import { getExpensesByGroupId, createExpense, updateExpense, deleteExpense, classifyExpense, orcDetectExpense } from "../controllers/expenses";


const expenseRoutes = express.Router();

expenseRoutes.get('/:groupId', authenticateToken, getExpensesByGroupId);
expenseRoutes.post('/', authenticateToken, createExpense);
expenseRoutes.put('/:id', authenticateToken, updateExpense);
expenseRoutes.delete('/:id', authenticateToken, deleteExpense);
expenseRoutes.post('/classify', authenticateToken, classifyExpense);
expenseRoutes.post('/orc', authenticateToken, orcDetectExpense);

export default expenseRoutes;
