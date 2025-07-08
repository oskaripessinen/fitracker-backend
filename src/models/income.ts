import sql from "../config/database";
import { Income, IncomeCategory, IncomeWithUser } from "../types/income";



export class IncomeModel {

  static async findByGroupId(groupId: number): Promise<IncomeWithUser[]> {
    const incomes = await sql<IncomeWithUser[]>`
      SELECT 
        i.*,
        u.full_name as received_by_name,
        u.email as received_by_email
      FROM income i
      LEFT JOIN users u ON i.user_id = u.google_id
      WHERE i.group_id = ${groupId}
      ORDER BY i.created_at DESC
    `;
    return incomes;
  }

  static async create(incomeData: {
    group_id: number;
    title: string;
    amount: number;
    category?: IncomeCategory;
    description?: string;
    userId: string;
    income_date?: Date;
  }): Promise<Income> {
    console.log("Creating income", incomeData);
    const incomes = await sql<Income[]>`
      INSERT INTO income (group_id, title, amount, category, description, user_id, income_date, created_at, updated_at)
      VALUES (
        ${incomeData.group_id}, 
        ${incomeData.title},
        ${incomeData.amount}, 
        ${incomeData.category || null},
        ${incomeData.description || null},
        ${incomeData.userId}, 
        ${incomeData.income_date || new Date()},
        NOW(), 
        NOW()
      )
      RETURNING *
    `;
    return incomes[0];
  }

  static async update(id: number, updates: Partial<Omit<Income, 'id' | 'created_at' | 'updated_at'>>): Promise<Income | null> {
    const setClause = Object.keys(updates)
      .filter(key => updates[key as keyof typeof updates] !== undefined)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    if (!setClause) return null;

    const values = Object.values(updates).filter(val => val !== undefined);
    values.push(id);

    const query = `UPDATE income SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const incomes = await sql.unsafe(query, values) as Income[];
    return incomes.length > 0 ? incomes[0] : null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await sql`DELETE FROM income WHERE id = ${id}`;
    return result.count > 0;
  }

  static async findById(id: number): Promise<IncomeWithUser | null> {
    const incomes = await sql<IncomeWithUser[]>`
      SELECT 
        i.*,
        u.full_name as received_by_name,
        u.email as received_by_email
      FROM income i
      LEFT JOIN users u ON i.user_id = u.google_id
      WHERE i.id = ${id}
    `;
    return incomes.length > 0 ? incomes[0] : null;
  }
}