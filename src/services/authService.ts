import Cookies from 'js-cookie';
import { sendRequest } from '@/utils/request';

export async function loginUser(values: { email: string }) {
    const data = await sendRequest('/auth/login', 'POST', values);
    Cookies.set('token', data.token, { expires: 1, secure: true, sameSite: 'Strict' });
    return data;
}

export async function registerUser(values: { email: string }) {
    const data = await sendRequest('/auth/register', 'POST', values);
    return data;
}

export async function logoutUser() {
    const data = await sendRequest('/auth/logout', 'POST');
    Cookies.remove('token');
    return data;
}
