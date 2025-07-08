import { Request, Response } from 'express';
import { IncomeService } from '../services/incomeService';

export const getIncomeByGroupId = async (req: Request, res: Response): Promise<void> => {
    try {
        const groupId = parseInt(req.params.groupId);
        if (isNaN(groupId)) {
            res.status(400).json({success: false, error: 'Invalid group id'})
            return;
        }

        const income = await IncomeService.getIncomeByGroup(groupId);
        res.status(200).json({success: true, count: income.length, data: income})

    } catch(error) {
            console.error('error fetching income: ', error)
            res.status(500).json({success: false, error: 'failed to fetch incomes'})
        }

}

export const createIncome = async (req: Request, res: Response): Promise<void> => {
    try {
        const incomeData = req.body;
        console.log('creating income', incomeData);
        const income = await IncomeService.createIncome(incomeData);
        res.status(201).json({success: true, data: income});
    }
    catch(error) {
        console.error("Error while creating income", error);

        res.status(400).json({success: false, error: 'Failed to create income'})
    }
}

export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
    try {
        const incomeId = parseInt(req.params.id);
        if (isNaN(incomeId)) {
            res.status(400).json({success: false, error: 'Invalid income id'});
            return;
        }
        const result = await IncomeService.deleteIncome(incomeId);
        res.status(200).json({success: true, data: result});

    } catch(error) {
        console.error("Error while deleting income", error);
        res.status(400).json({success: false, error: 'Failed to delete income'})
    }
}

