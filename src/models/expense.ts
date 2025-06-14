import sql from '../config/database.js';

export class ExpenseModel {

  static async findByGroupId(groupId: number) {
    const expenses = await sql`
      SELECT 
        e.*,
        u.full_name as paid_by_name,
        u.email as paid_by_email
      FROM expenses e
      LEFT JOIN users u ON e.paid_by::text = u.google_id::text
      WHERE e.group_id = ${groupId}
      ORDER BY e.created_at DESC
    `;
    return expenses;
  }

  static async create(expenseData: {
    group_id: number;
    amount: number;
    title: string;
    description?: string;
    category?: string;
    paid_by: string;
    expense_date?: Date;
  }) {
    const expenses = await sql`
      INSERT INTO expenses (group_id, amount, title, description, category, paid_by, expense_date, created_at, updated_at)
      VALUES (
        ${expenseData.group_id}, 
        ${expenseData.amount}, 
        ${expenseData.title}, 
        ${expenseData.description || null},
        ${expenseData.category || null},
        ${expenseData.paid_by}, 
        ${expenseData.expense_date || new Date()},
        NOW(), 
        NOW()
      )
      RETURNING *
    `;
    return expenses[0];
  }

  static async update(id: number, updates: Record<string, any>) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE expenses SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const expenses = await sql.unsafe(query, values);
    return expenses.length > 0 ? expenses[0] : null;
  }

  static async delete(id: number) {
    const result = await sql`DELETE FROM expenses WHERE id = ${id}`;
    return result.count;
  }

  static async findById(id: number) {
    const expenses = await sql`SELECT * FROM expenses WHERE id = ${id}`;
    return expenses.length > 0 ? expenses[0] : null;
  }

  static async getGroupTotal(groupId: number) {
    const result = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses 
      WHERE group_id = ${groupId}
    `;
    return parseFloat(result[0]?.total) || 0;
  }

  static async getUserExpensesInGroup(groupId: number, userId: string) {
    const result = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses 
      WHERE group_id = ${groupId} AND paid_by::text = ${userId}
    `;
    return parseFloat(result[0]?.total) || 0;
  }
}