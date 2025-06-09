import express from "express";
import { authenticateToken } from "../middleware/auth";
import { getExpensesByGroupId, createExpense, updateExpense, deleteExpense } from "../controllers/expenses";


const expenseRoutes = express.Router();

expenseRoutes.get('/:groupId', authenticateToken, getExpensesByGroupId);
expenseRoutes.post('/', authenticateToken, createExpense);
expenseRoutes.put('/:id', authenticateToken, updateExpense);
expenseRoutes.delete('/:id', authenticateToken, deleteExpense);

export default expenseRoutes;
