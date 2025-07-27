import { IncomeModel } from "../models/income";
import { CreateIncomeRequest } from "../types/income";
export class IncomeService {
  static async getIncomeByGroup(groupId: number) {
    try {
        const incomes = await IncomeModel.findByGroupId(groupId);
        return incomes;
    }
    catch (error) {
        throw error;
    }
  }

  static async createIncome(incomeData: CreateIncomeRequest) {
    try {
        if (!incomeData.title) {
            throw new Error("Income title required");
        }
        const income = await IncomeModel.create(incomeData);
        return income;

    } catch(error) {
        throw error;
    }
    }
    static async deleteIncome(incomeId: number) {
        try {
            const result = await IncomeModel.delete(incomeId);
            if (result === false) {
                throw new Error("Delete failed!");
            }
            return { success: true };
        }
        catch (error) {
            throw error;
        }

    }
} 