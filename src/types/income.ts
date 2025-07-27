export type IncomeCategory = 'salary' | 'freelance' | 'investments' | 'business' | 'gifts' | 'other';

export interface Income {
  id: number;
  group_id: number;
  title: string;
  amount: number;
  category?: IncomeCategory;
  description?: string;
  user_id: string;
  income_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateIncomeRequest {
  group_id: number;
  title: string;
  amount: number;
  category?: IncomeCategory;
  description?: string;
  userId: string;
  income_date?: Date;
}

export interface UpdateIncomeRequest {
  title?: string;
  amount?: number;
  category?: IncomeCategory;
  description?: string;
  income_date?: Date;
}

export interface IncomeWithUser extends Income {
  received_by_name?: string;
  received_by_email?: string;
}