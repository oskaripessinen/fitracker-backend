export interface Investment {
  id: number;
  group_id: number;
  ticker: string;
  name: string;
  quantity: number;
  added_by: number,
  purchase_price: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export interface createInvestmentRequest {
  group_id: number;
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  added_by: string;
  purchase_price: number;
  purchase_date: Date;
}

export interface InvestmentWithUser extends Investment {
    added_by_name?: string;
    added_by_email?: string;
}