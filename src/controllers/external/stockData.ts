// src/controllers/stocks.ts
import { Request, Response } from 'express';
import { StockApiService } from '../../services/external/getStockData';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const searchStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ 
        success: false,
        error: 'Search query is required' 
      });
      return;
    }

    const stockData = await StockApiService.searchStocks(query);
    
    res.status(200).json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error in searchStocks controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search stocks'
    });
  }
};

export const getStockPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticker } = req.params;
    
    if (!ticker) {
      res.status(400).json({
        success: false,
        error: 'Ticker symbol is required'
      });
      return;
    }

    const priceData = '';
    
    res.status(200).json({
      success: true,
      data: priceData
    });
  } catch (error) {
    console.error('Error in getStockPrice controller:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock price'
    });
  }
};