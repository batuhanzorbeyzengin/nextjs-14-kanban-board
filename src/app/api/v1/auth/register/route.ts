import { prisma } from '../../../../../../server/db/client';
import { emailSchema } from '@/validations/register';
import { respondWithSuccess, respondWithError } from '@/utils/response';
import { handleError } from '@/utils/errorHandler';

/**
 * Handles the registration request by validating the email,
 * checking for existing users, and creating a new user.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the incoming data
    await validateEmail(data);

    // Check if the user already exists
    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
      return respondWithError('User with this email already exists', 400);
    }

    // Create the new user
    await createUser(data.email);

    return respondWithSuccess({ message: 'User created successfully' }, 201);
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
 * Creates a new user with the given email.
 *
 * @param {string} email - The email address of the new user.
 * @returns {Promise<void>}
 */
async function createUser(email: string) {
  await prisma.user.create({
    data: { email },
  });
}
