import { Investment } from "../types/investment";
import sql from "../config/database";

export class investmentModel {

    static async create(investmentData: {
        group_id: number,
        ticker: string,
        name: string,
        quantity: number,
        added_by: string,
        purchase_price: number,
        purchase_date: Date
    }): Promise<Investment> {

        const investments = await sql<Investment[]>`INSERT INTO investments (group_id, ticker, name, quantity, purchase_price, purchase_date, added_by, created_at, updated_at)
            VALUES (
                ${investmentData.group_id},
                ${investmentData.ticker},
                ${investmentData.name},
                ${investmentData.quantity},
                ${investmentData.purchase_price},
                ${investmentData.purchase_date},
                ${investmentData.added_by},
                NOW(),
                NOW()
            )
            RETURNING *
            `;
            return investments[0];
        }
    
}