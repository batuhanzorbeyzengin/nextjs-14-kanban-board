import { prisma } from '../../../../../../server/db/client';
import { emailSchema } from '@/validations/register';
import { generateToken } from '@/utils/jwt';
import { encrypt } from '@/utils/crypto';
import { v4 as uuidv4 } from 'uuid';
import { respondWithError, respondWithSuccess } from '@/utils/response';
import { handleError } from '@/utils/errorHandler';

/**
 * Handles the login request by validating the email,
 * generating a token, and creating a session.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data
    await validateEmail(data);

    const user = await findUserByEmail(data.email);

    if (!user) {
      return respondWithError('User with this email does not exist', 404);
    }

    const token = generateToken({ userId: user.id, email: user.email });
    const encryptedToken = encrypt(token);
    await createSession(user.id, encryptedToken);

    return respondWithSuccess({ token });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Validates the email using the defined schema.
 *
 * @param {Object} data - The data to validate.
 * @throws {Yup.ValidationError} - If validation fails.
 */
async function validateEmail(data: any) {
  await emailSchema.validate(data, { abortEarly: false });
}

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email address to search for.
 * @returns {Promise<any>} - The user object if found, null otherwise.
 */
async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Creates a new session for the user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} token - The encrypted token.
 * @returns {Promise<void>}
 */
async function createSession(userId: string, token: string) {
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      token,
      expiresAt,
    },
  });
}
