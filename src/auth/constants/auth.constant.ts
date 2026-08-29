// Nama cookie dibuat konstan agar controller dan strategy selalu memakai nama yang sama.
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Opsi cookie access token.
// Access token berumur pendek sehingga dampak kebocoran token dapat dibatasi.
export const accessTokenCookieOptions = () => ({
  // JavaScript di browser tidak dapat membaca cookie ini.
  httpOnly: true,
  // HTTPS diwajibkan di production, tetapi localhost masih boleh memakai HTTP.
  secure: process.env.NODE_ENV === 'production',
  // Cookie tetap dikirim pada request same-site dan membantu mengurangi CSRF sederhana.
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000,
  path: '/',
});

// Opsi cookie refresh token.
// Refresh token berumur lebih panjang dan hanya dipakai pada endpoint refresh.
export const refreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});