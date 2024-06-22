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
 * Handles POST requests to create a new card.
 * The new card will be assigned to the "Backlog" section with order 1
 * and will be associated with the specified board.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
    try {
        const payload = await authenticate(request);
        const data = await request.json();

        if (!data.title || !data.color || !data.boardId) {
            return respondWithError('Title, color, and boardId are required', 400);
        }

        // Find the Backlog section
        const backlogSection = await prisma.section.findUnique({
            where: { name: "Backlog" },
        });

        if (!backlogSection) {
            return respondWithError('Backlog section not found', 404);
        }

        const order = await prisma.card.count({
            where: { sectionId: backlogSection.id },
        }) + 1;

        const card = await prisma.card.create({
            data: {
                title: data.title,
                color: data.color,
                order: order,
                sectionId: backlogSection.id,
                boardId: data.boardId,
            },
        });

        return respondWithSuccess(card, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * Handles GET requests to list all cards for a specific board.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(request: Request) {
    try {
        // const payload = await authenticate(request);
        const { searchParams } = new URL(request.url);
        const boardId = searchParams.get('boardId');

        if (!boardId) {
            return respondWithError('boardId is required', 400);
        }

        const cards = await prisma.card.findMany({
            where: { boardId },
            select: {
                id: true,
                title: true,
                color: true,
                order: true,
                section: {
                    select: {
                        id: true,
                        name: true,
                        order: true,
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        });

        return respondWithSuccess(cards);
    } catch (error) {
        return handleError(error);
    }
}

