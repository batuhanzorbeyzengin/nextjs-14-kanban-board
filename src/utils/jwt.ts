import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'oRN2oxu7Vnj5vCsjSh7lTEc1s0xvmUZx';

interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generates a JSON Web Token (JWT) for the given payload.
 *
 * @param {TokenPayload} payload - The payload to include in the token.
 * @returns {string} - The generated JWT.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verifies the given JSON Web Token (JWT) and returns the decoded payload.
 *
 * @param {string} token - The JWT to verify.
 * @returns {TokenPayload} - The decoded payload from the verified token.
 * @throws {Error} - Throws an error if the token is invalid or expired.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
