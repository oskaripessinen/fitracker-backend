import { jwtVerify, createRemoteJWKSet } from 'jose';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dhyycqjspzzacmfthfjc.supabase.co';

// JWK endpoint for Supabase
const JWKS = createRemoteJWKSet(new URL(`${SUPABASE_URL}/rest/v1/auth/jwks`));

export const verifySupabaseToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: SUPABASE_URL,
    });
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
