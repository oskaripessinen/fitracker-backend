import { createInvestmentRequest } from '../types/investment'
import { investmentModel } from '../models/investment'


export class InvestmentService {
    static async createInvestment (investmentData: createInvestmentRequest) {
        try {
            const investment = await investmentModel.create(investmentData);
            return investment;
            
        } catch(error) {
            throw(error)
        }
    }
}