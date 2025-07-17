import axios from 'axios';

const stockApiClient = axios.create({
  baseURL: process.env.STOCK_API_URL,
  timeout: 15000,
  headers: {
    'Authorization': `Bearer ${process.env.STOCK_API_KEY}`
  }
});

export class StockApiService {
    static async searchStocks(searchWord: string) {
    try {
      const { data } = await stockApiClient.get(`/v6/finance/recommendationsbysymbol/${searchWord}`);
      return data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw new Error('Failed to fetch stock data');
    }
  }
}