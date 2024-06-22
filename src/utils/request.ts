import Cookies from 'js-cookie';

const BASE_URL = '/api/v1';

/**
 * Sends an HTTP request to the specified endpoint with the given method and body.
 *
 * @param {string} endpoint - The API endpoint (relative to the base URL).
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {any} [body] - The request body to be sent (optional).
 * @param {boolean} [includeToken=false] - Whether to include the token in the headers (optional).
 * @returns {Promise<any>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an error if the response is not ok.
 */
export async function sendRequest(
    endpoint: string,
    method: string,
    body?: any,
    includeToken: boolean = false
): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeToken) {
        const token = Cookies.get('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
    }

    return response.json();
}
