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
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth header:', authHeader); // Debug
    console.log('Extracted token:', token); // Debug

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    // Tarkista Supabase token
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': process.env.SUPABASE_ANON_KEY!
      }
    });

    if (!response.ok) {
      console.log('Supabase auth failed:', response.status); // Debug
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    const userData = await response.json();
    console.log('Authenticated user:', userData); // Debug
    
    req.user = {
      id: userData.id, // Google ID
      email: userData.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};