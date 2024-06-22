import type { NextRequest } from 'next/server';
import { prisma } from '../../../../../../server/db/client';
import { decrypt } from '@/utils/crypto';
import { verifyToken } from '@/utils/jwt';
import { respondWithSuccess, respondWithError } from '@/utils/response';
import { handleError } from '@/utils/errorHandler';

/**
 * Handles the logout request by validating the token,
 * checking the session, and deleting the session.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: NextRequest) {
  const token = getTokenFromCookies(request);

  if (!token) {
    return respondWithError('Not authenticated', 401);
  }

  try {
    const payload = verifyToken(token);
    const session = await prisma.session.findFirst({ where: { userId: payload.userId } });

    if (!session) {
      return respondWithError('Session not found', 404);
    }

    if (!isTokenValid(token, session.token)) {
      return respondWithError('Invalid session', 401);
    }

    await prisma.session.delete({ where: { id: session.id } });
    return respondWithSuccess({ message: 'Logged out successfully' }, 200);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Extracts the token from cookies.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {string | null} - The token if found, null otherwise.
 */
function getTokenFromCookies(request: NextRequest): string | null {
  const tokenCookie = request.cookies.get('token');
  return tokenCookie ? tokenCookie.value : null;
}

/**
 * Checks if the provided token is valid by comparing it
 * with the decrypted token stored in the session.
 *
 * @param {string} token - The token from the request.
 * @param {string} encryptedToken - The encrypted token from the session.
 * @returns {boolean} - True if the token is valid, false otherwise.
 */
function isTokenValid(token: string, encryptedToken: string): boolean {
  const decryptedToken = decrypt(encryptedToken);
  return token === decryptedToken;
}
