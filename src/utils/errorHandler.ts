import { NextResponse } from 'next/server';
import * as Yup from 'yup';

/**
 * Handles errors that occur during the request processing.
 *
 * @param {any} error - The error object.
 * @returns {NextResponse} - The response object.
 */
export function handleError(error: any): NextResponse {
  if (error instanceof Yup.ValidationError) {
    return NextResponse.json(
      { errors: error.errors },
      { status: 400 }
    );
  }
  console.error('Internal server error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
