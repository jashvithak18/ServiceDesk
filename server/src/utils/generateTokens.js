import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'servicedesk_jwt_access_secret_key_2026',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (res, userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'servicedesk_jwt_refresh_secret_key_2026',
    { expiresIn: '7d' }
  );

  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  return refreshToken;
};

export const clearRefreshTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: new Date(0),
  });
};
