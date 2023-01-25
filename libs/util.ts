import { request } from 'undici';

/**
 *
 * Fetches a buffer from a URL. This is faster thanks to undici.
 *
 * @example
 * ```ts
 * const buffer = await fetchBuffer('https://example.com/image.png');
 * ```
 * @param  input The URL to fetch
 * @returns The buffer
 */
export const fetchBuffer = async (input: string | Buffer): Promise<Buffer> => {
  if (!input) throw new Error('Invalid input');
  if (Buffer.isBuffer(input)) return input;
  if (typeof input === 'string' && input.startsWith('http')) {
    const res = await request(input);
    const arrBuffer = await res.body.arrayBuffer();
    return Buffer.from(arrBuffer);
  }
  throw new Error('Invalid input');
};
