import { Request, Response, NextFunction } from 'express';
import { LoginRequest, LoginResponse } from '../types/login';

export const validateToken = async (req: Request<{}, LoginResponse, LoginRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=id_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY!
      },
      body: JSON.stringify({
        provider: 'google',
        id_token: token
      })
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const supabaseAuth = await response.json();
    const user = supabaseAuth.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          google_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          createdAt: new Date(user.created_at)
        },
        token: supabaseAuth.access_token
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};