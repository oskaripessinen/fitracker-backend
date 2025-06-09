import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';

export const getExpensesByGroupId = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupId = parseInt(req.params.groupId);
    if (isNaN(groupId)) {
      res.status(400).json({ success: false, error: 'Invalid group ID' });
      return;
    }

    const expenses = await ExpenseService.getExpensesByGroupId(groupId);
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseData = req.body;
    const expense = await ExpenseService.createExpense(expenseData);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create expense'
    });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseId = parseInt(req.params.id);
    if (isNaN(expenseId)) {
      res.status(400).json({ success: false, error: 'Invalid expense ID' });
      return;
    }

    const updates = req.body;
    const updatedExpense = await ExpenseService.updateExpense(expenseId, updates);
    res.status(200).json({ success: true, data: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update expense'
    });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseId = parseInt(req.params.id);
    if (isNaN(expenseId)) {
      res.status(400).json({ success: false, error: 'Invalid expense ID' });
      return;
    }

    const result = await ExpenseService.deleteExpense(expenseId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete expense'
    });
  }
};

