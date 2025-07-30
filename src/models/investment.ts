import { Investment, InvestmentWithUser } from "../types/investment";
import sql from "../config/database";

export class investmentModel {

    static async create(investmentData: {
        group_id: number,
        ticker: string,
        name: string,
        type: string,
        quantity: number,
        added_by: string,
        purchase_price: number,
        purchase_date: Date
    }): Promise<Investment> {

        const investments = await sql<Investment[]>`INSERT INTO investments (group_id, ticker, name, type, quantity, purchase_price, purchase_date, added_by, created_at, updated_at)
            VALUES (
                ${investmentData.group_id},
                ${investmentData.ticker},
                ${investmentData.name},
                ${investmentData.type},
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

        static async findByGroupId(groupId: number): Promise<InvestmentWithUser[]> {
            const investments = await sql<InvestmentWithUser[]>`
                SELECT 
                    i.*,
                    u.full_name as added_by_name,
                    u.email as added_by_email
                FROM investments i
                LEFT JOIN users u ON i.added_by = u.google_id
                WHERE i.group_id = ${groupId}
                ORDER BY i.created_at DESC
            `;
            return investments;
        }
    
}