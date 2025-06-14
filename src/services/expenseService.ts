import { ExpenseModel } from "../models/expense";
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

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

  static async classifyExpense(data: string) {
    const model = process.env.MODEL;
    if (!model) {
      throw new Error("Model not specified in environment variables");
    }
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
            Classify the following expense into one of the following categories:

            [food, travel, entertainment, utilities, healthcare, other]

            Expense: ${data}

            Respond with only the category name. Do not explain. Do not use any punctuation.
                  `.trim()
                }
              ],
              model: model,
        });
      if (response.choices[0]?.message?.content) {
        const category = response.choices[0].message.content.trim();
        console.log("AI Category:", response.choices);
        if (['food', 'housing' ,'transportation' ,'entertainment' ,'utilities' ,'health' ,'clothing' ,'other'].includes(category)) {
          return category;
        } else {
          throw new Error("Invalid category returned from AI model");
        }
      }
      throw new Error("No category returned from AI model");
  }
}