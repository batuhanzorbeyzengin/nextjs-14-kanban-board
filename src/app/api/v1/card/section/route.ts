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
 * Handles POST requests to update the section of a card.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
    try {
      const payload = await authenticate(request);
      const data = await request.json();
  
      if (!data.cardId || !data.newSectionId) {
        return respondWithError('cardId and newSectionId are required', 400);
      }
  
      const card = await prisma.card.findUnique({
        where: { id: data.cardId },
      });
  
      if (!card) {
        return respondWithError('Card not found', 404);
      }
  
      const newSection = await prisma.section.findUnique({
        where: { id: data.newSectionId },
      });
  
      if (!newSection) {
        return respondWithError('Section not found', 404);
      }
  
      const newOrder = await prisma.card.count({
        where: { sectionId: data.newSectionId },
      }) + 1;
  
      const updatedCard = await prisma.card.update({
        where: { id: data.cardId },
        data: {
          sectionId: data.newSectionId,
          order: newOrder,
        },
      });
  
      return respondWithSuccess(updatedCard, 200);
    } catch (error) {
      return handleError(error);
    }
  }

/**
 * Handles GET requests to fetch all sections with only id and name.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(request: Request) {
    try {
        const sections = await prisma.section.findMany({
            select: {
                id: true,
                name: true,
                order: true,
            },
        });

        return respondWithSuccess(sections, 200);
    } catch (error) {
        return handleError(error);
    }
}
