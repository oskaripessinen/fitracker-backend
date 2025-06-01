// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token?.substring(0, 20) + '...');

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
      return; 
    }

    // Tarkista environment muuttujat
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      res.status(500).json({ 
        success: false, 
        error: 'Server configuration error' 
      });
      return;
    }

    const supabaseUrl = `${process.env.SUPABASE_URL}/auth/v1/user`;
    console.log('Validating token with:', supabaseUrl);

    const response = await fetch(supabaseUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('Supabase response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Supabase auth failed:', response.status, errorText);
      res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
      return;
    }

    const userData = await response.json();
    console.log('Authenticated user ID:', userData.id);
    
    if (!userData.id || !userData.email) {
      console.error('Invalid user data from Supabase:', userData);
      res.status(401).json({ 
        success: false, 
        error: 'Invalid user data' 
      });
      return;
    }
    
    req.user = {
      id: userData.id,
      email: userData.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
    return;
  }
};