import axios from 'axios';

const stockApiClient = axios.create({
  baseURL: 'https://yfapi.net',
  timeout: 15000,
  headers: {
    'x-api-key': process.env.STOCK_API_KEY
  }
});

export interface StockPriceResponse {
  ticker: string;
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  currency?: string;
}

export class StockApiService {
  
  static async getStockQuote(ticker: string) {
    try {
      const { data } = await stockApiClient.get(`/v11/finance/quoteSummary/${ticker}`, {
        params: {
          modules: 'defaultKeyStatistics,assetProfile,price'
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Failed to fetch stock data');
    }
  }

  static async searchStocks(searchWord: string) {
    try {
      const { data } = await stockApiClient.get('/v6/finance/autocomplete', {
        params: {
          query: searchWord,
          lang: 'en',
        }
      });

      

      return data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 403) {
          throw new Error('API key invalid or subscription required');
        }
        throw new Error(`API Error: ${status} - ${message}`);
      }
      throw new Error('Failed to search stocks');
    }
  }

  static async getStockPrice(ticker: string, date: Date): Promise<StockPriceResponse> {
    try {
      const dateString = date.toISOString().split('T')[0];
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const period1 = Math.floor(startOfDay.getTime() / 1000);
      const period2 = Math.floor(endOfDay.getTime() / 1000);

      const { data } = await stockApiClient.get(`/v8/finance/chart/${ticker}`, {
        params: {
          period1,
          period2,
          interval: '1d'
        }
      });

      if (data?.chart?.result?.[0]) {
        const result = data.chart.result[0];
        const meta = result.meta;
        const timestamps = result.timestamp;
        const quote = result.indicators?.quote?.[0];

        if (timestamps && timestamps.length > 0 && quote) {
          const latestIndex = timestamps.length - 1;
          
          return {
            ticker: ticker.toUpperCase(),
            date: dateString,
            price: quote.close?.[latestIndex] || meta?.regularMarketPrice || 0,
            open: quote.open?.[latestIndex] || 0,
            high: quote.high?.[latestIndex] || 0,
            low: quote.low?.[latestIndex] || 0,
            volume: quote.volume?.[latestIndex] || 0,
            currency: meta?.currency || 'USD'
          };
        }
        
        return {
          ticker: ticker.toUpperCase(),
          date: dateString,
          price: meta?.regularMarketPrice || 0,
          open: meta?.regularMarketOpen || 0,
          high: meta?.regularMarketDayHigh || 0,
          low: meta?.regularMarketDayLow || 0,
          volume: meta?.regularMarketVolume || 0,
          currency: meta?.currency || 'USD'
        };
      }
      
      throw new Error('No price data available for the specified date');
      
    } catch (error) {
      console.error('Error fetching stock price:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        throw new Error(`API Error: ${status} - ${message}`);
      }
      throw new Error('Failed to fetch stock price');
    }
  }

  static async getCurrentStockPrice(ticker: string): Promise<StockPriceResponse> {
    return this.getStockPrice(ticker, new Date());
  }

  static async getStockNews(ticker: string) {
    try {
      const { data } = await stockApiClient.get(`/v1/finance/search`, {
        params: {
          q: ticker,
          quotesCount: 1,
          newsCount: 10
        }
      });
      return data.news || [];
    } catch (error) {
      console.error('Error fetching stock news:', error);
      throw new Error('Failed to fetch stock news');
    }
  }

  // Mock data jos API ei toimi
  static async getStockPriceMock(ticker: string, date: Date): Promise<StockPriceResponse> {
    const dateString = date.toISOString().split('T')[0];
    
    return {
      ticker: ticker.toUpperCase(),
      date: dateString,
      price: 150.00 + Math.random() * 50, // Random hinta 150-200 välillä
      open: 148.00,
      high: 155.00,
      low: 147.50,
      volume: 25000000,
      currency: 'USD'
    };
  }
}