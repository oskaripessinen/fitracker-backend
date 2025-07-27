import { Request, Response } from 'express'
import { InvestmentService } from '../services/investmentService'

export const createInvestment = async (req: Request, res: Response): Promise<void> => {
    try {
        const investmentData = req.body;
        console.log('Received investment data:', investmentData);
        
        if (!investmentData.group_id) {
            console.log('Missing group_id');
            res.status(400).json({success: false, error: 'group_id is required'});
            return;
        }
        
        if (!investmentData.ticker) {
            console.log('Missing ticker');
            res.status(400).json({success: false, error: 'ticker is required'});
            return;
        }
        
        if (!investmentData.name) {
            console.log('Missing name');
            res.status(400).json({success: false, error: 'name is required'});
            return;
        }
        
        if (!investmentData.quantity) {
            console.log('Missing quantity');
            res.status(400).json({success: false, error: 'quantity is required'});
            return;
        }
        
        if (!investmentData.added_by) {
            console.log('Missing added_by');
            res.status(400).json({success: false, error: 'added_by is required'});
            return;
        }
        
        console.log('Calling InvestmentService.createInvestment...');
        const investment = await InvestmentService.createInvestment(investmentData);
        console.log('Investment created successfully:', investment);
        
        res.status(201).json({success: true, data: investment});
    } catch(error) {
        console.error('Error in createInvestment controller:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        res.status(400).json({
            success: false, 
            error: error instanceof Error ? error.message : 'failed to add investment'
        });
    }
}