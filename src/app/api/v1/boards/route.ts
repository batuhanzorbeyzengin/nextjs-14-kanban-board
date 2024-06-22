import { NextResponse } from 'next/server';
import { prisma } from '../../../../../server/db/client';
import { verifyToken } from '@/utils/jwt';
import { respondWithSuccess, respondWithError } from '@/utils/response';
import { handleError } from '@/utils/errorHandler';

// Middleware to authenticate the user
async function authenticate(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new Error('Not authenticated');
  }
  return verifyToken(token);
}

/**
 * Validate board data.
 *
 * @param {any} data - The board data.
 * @throws {Error} - If validation fails.
 */
function validateBoardData(data: any) {
  if (!data.name) {
    throw new Error('Board name is required');
  }
}

/**
 * Fetch all boards for the authenticated user.
 *
 * @param {string} userId - The ID of the authenticated user.
 * @returns {Promise<any>} - The list of boards with id, name, and createdAt fields.
 */
async function fetchBoards(userId: string) {
  return prisma.board.findMany({
    where: { userId },
    select: { id: true, name: true, createdAt: true },
  });
}

/**
 * Create a new board for the authenticated user.
 *
 * @param {string} userId - The ID of the authenticated user.
 * @param {string} name - The name of the new board.
 * @returns {Promise<any>} - The created board.
 */
async function createBoard(userId: string, name: string) {
  return prisma.board.create({
    data: { name, userId },
  });
}

/**
 * Handles GET requests to list all boards for the authenticated user.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(request: Request) {
  try {
    const payload = await authenticate(request);
    const boards = await fetchBoards(payload.userId);
    return respondWithSuccess(boards);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Handles POST requests to create a new board for the authenticated user.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
  try {
    const payload = await authenticate(request);
    const data = await request.json();

    validateBoardData(data);

    const board = await createBoard(payload.userId, data.name);
    return respondWithSuccess({ message: 'Board created successfully' }, 201);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target.includes('name')) {
      return respondWithError('Board name must be unique', 400);
    }
    return handleError(error);
  }
}
