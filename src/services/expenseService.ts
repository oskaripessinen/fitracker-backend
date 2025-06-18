import { ExpenseModel } from "../models/expense";
import Together from "together-ai";
import { ImageAnnotatorClient } from '@google-cloud/vision';

const vision = require('@google-cloud/vision');

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

            Also, give total purchase price use the last number mentioned in the expense or number that comes after total.

            lastly give name for the expense.

            Expense: ${data}

            Respond with only the category name, the total price in euros and the expense name. Do not explain. Do not use any punctuation.
                  `.trim()
                }
              ],
              model: model,
        });
      if (response.choices[0]?.message?.content) {
        const [category, totalPrice, expenseName] = response.choices[0].message.content.trim().split(" ");
        console.log("AI Category:", response.choices);
        if (['travel','food', 'housing' ,'transportation' ,'entertainment' ,'utilities' ,'health' ,'clothing' ,'other'].includes(category)) {
          return { category, totalPrice: parseFloat(totalPrice), expenseName: expenseName };
        } else {
          throw new Error("Invalid category returned from AI model");
        }
      }
      throw new Error("No category returned from AI model");
  }

  static async orcDetectExpense(base64Image: string): Promise<string> {
    try {
      console.log('Starting OCR detection...');
      

      const client = new ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      });

      const request = {
        image: {
          content: base64Image
        }
      };

      const [result] = await client.textDetection(request);
      const detections = result.textAnnotations;
      console.log('OCR detection completed:', detections);
      
      if (!detections || detections.length === 0) {
        return 'No text detected';
      }

      return detections[0].description || '';
    } catch (error) {
      console.error('OCR detection failed:', error);
      throw new Error('Failed to detect text from image');
    }
  }
}