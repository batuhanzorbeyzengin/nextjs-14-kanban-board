import { NextResponse } from 'next/server';

/**
 * Responds with a success message.
 *
 * @param {Object} data - The data to include in the response.
 * @param {number} status - The HTTP status code.
 * @returns {NextResponse} - The response object.
 */
export function respondWithSuccess(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Responds with an error message.
 *
 * @param {string} message - The error message.
 * @param {number} status - The HTTP status code.
 * @returns {NextResponse} - The response object.
 */
export function respondWithError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
