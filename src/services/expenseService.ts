import { ExpenseModel } from "../models/expense";

export class ExpenseService {
  static async getExpensesByGroupId(groupId: number) {
    try {
      const expenses = await ExpenseModel.findByGroupId(groupId);
      return expenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  }

  static async createExpense(expenseData: {
    group_id: number;
    amount: number;
    title: string;
    description?: string;
    category?: string;
    paid_by: string;
    expense_date?: Date;
  }) {
    try {
      if (!expenseData.title || expenseData.title.trim().length === 0) {
        throw new Error("Expense title is required");
      }

      if (expenseData.amount <= 0) {
        throw new Error("Expense amount must be greater than zero");
      }

      const expense = await ExpenseModel.create(expenseData);
      return expense;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  }

  static async updateExpense(id: number, updates: Record<string, any>) {
    try {
      const updatedExpense = await ExpenseModel.update(id, updates);
      if (!updatedExpense) {
        throw new Error("Expense not found or update failed");
      }
      return updatedExpense;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  }

  static async deleteExpense(id: number) {
    try {
      const result = await ExpenseModel.delete(id);
      if (result === 0) {
        throw new Error("Expense not found or delete failed");
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  }
}