import jwt from 'jsonwebtoken';
import { Request } from 'express';

interface Payload {
  exp: number;
  iat: number;
  sub: string;
}

const _getSecret = async (): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing env variable: JWT_SECRET');
  }
  const appSecretName = process.env.JWT_SECRET;
  console.log('JWT Secret:', appSecretName);
  return appSecretName;
};

const encodeAuthToken = async (userId: number): Promise<string> => {
  const currentTime = new Date();
  const payload: Payload = {
    exp: currentTime.getTime() + 365 * 24 * 60 * 60 * 1000, // 1 year expiration
    iat: currentTime.getTime(),
    sub: String(userId),
  };
  console.log('Token Payload:', payload);
  const secret = await _getSecret();
  const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
  console.log('Generated JWT Token:', token);

  return token;
};

const decodeAuthToken = async (authToken: string): Promise<string> => {
  const secret = await _getSecret();
  try {
    const payload = jwt.verify(authToken, secret, { algorithms: ['HS256'] });
    console.log('Decoded Payload:', payload);

    if (typeof payload === 'object' && 'sub' in payload) {
      return payload.sub as string;
    }
    throw new jwt.JsonWebTokenError('Invalid token.');
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired.');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token.');
    }
    throw new Error('Access denied.');
  }
};

const tryGetUserIdFromAuthToken = async (request: Request): Promise<string | null> => {
    const secret = await _getSecret();
    const authHeader = request.header('authorization');
    console.log('Authorization Header:', authHeader);
  
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);
  
    // Using jwt.decode to decode the token without verifying
    const decoded = jwt.decode(token);
    console.log('Decoded Token Payload (using decode):', decoded);
  
    if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
      return decoded.sub as string;
    }
  
    console.log('Invalid token structure or missing sub.');
    return null;
  };
  

export { encodeAuthToken, decodeAuthToken, tryGetUserIdFromAuthToken };