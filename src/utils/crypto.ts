import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const SECRET_KEY = process.env.SECRET_KEY || '0123456789abcdef0123456789abcdef'; // 32 bytes key
const IV_LENGTH = 16; // Initialization vector length

if (Buffer.from(SECRET_KEY).length !== 32) {
  throw new Error('SECRET_KEY must be 32 bytes long');
}

/**
 * Encrypts the given text using AES-256-CTR algorithm.
 *
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text in the format iv:encrypted.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts the given hash using AES-256-CTR algorithm.
 *
 * @param {string} hash - The hash to decrypt in the format iv:encrypted.
 * @returns {string} - The decrypted text.
 */
export function decrypt(hash: string): string {
  const [iv, encrypted] = hash.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
  return decrypted.toString();
}
