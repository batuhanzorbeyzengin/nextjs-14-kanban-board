import { prisma } from '../../../../../../server/db/client';
import { verifyToken } from '@/utils/jwt';
import { respondWithSuccess, respondWithError } from '@/utils/response';
import { handleError } from '@/utils/errorHandler';

/**
 * Middleware to authenticate the user
 */
async function authenticate(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    throw new Error('Not authenticated');
  }
  return verifyToken(token);
}

/**
 * Handles POST requests to update the order of cards within a section.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
  try {
    const payload = await authenticate(request);
    const data = await request.json();
    
    if (!data.sectionId || !Array.isArray(data.cards) || data.cards.length === 0) {
      return respondWithError('sectionId and cards array are required', 400);
    }

    const section = await prisma.section.findUnique({
      where: { id: data.sectionId },
    });

    if (!section) {
      return respondWithError('Section not found', 404);
    }

    // Start a transaction to update card orders
    const updatePromises = data.cards.map((card: { id: string, order: number }) =>
      prisma.card.updateMany({
        where: {
          id: card.id,
          sectionId: data.sectionId,
        },
        data: {
          order: card.order,
        },
      })
    );

    await prisma.$transaction(updatePromises);

    return respondWithSuccess({ message: 'Card order updated successfully' });
  } catch (error) {
    return handleError(error);
  }
}
