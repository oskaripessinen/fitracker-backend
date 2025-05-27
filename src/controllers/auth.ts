import { Request, Response, NextFunction } from 'express';
import { verifySupabaseToken } from '../utils/verifySupabaseToken';
import { LoginRequest, LoginResponse } from '../types/login';
import { SupabaseJWTPayload } from '../types/login';

export const validateToken = async (req: Request<{}, LoginResponse, LoginRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Validating Google Token...');
    const { googleToken } = req.body;
    console.log('Received Google Token:', googleToken);
    const decodedToken = await verifySupabaseToken(googleToken) as unknown as SupabaseJWTPayload;
    console.log('Decoded Token:', decodedToken);
    const user = {
      google_id: decodedToken.sub,
      email: decodedToken.email,
      full_name: decodedToken.user_metadata?.full_name || '',
      avatar: decodedToken.user_metadata?.avatar_url || null,
      createdAt: new Date(decodedToken.created_at)
    };
    
    res.status(200).json({
      success: true,
      data: {
        user,
        token: googleToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};