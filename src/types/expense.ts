export interface CreateExpenseRequest {
    group_id: number;
    amount: number;
    title: string;
    description?: string;
    category?: string;
    paid_by: string;
    expense_date?: Date;
}