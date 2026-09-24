import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, clearRefreshTokenCookie } from '../utils/generateTokens.js';

// Random subtle editorial palette colors for avatar fallback
const AVATAR_COLORS = ['#B5502F', '#3E5C76', '#3D6B4F', '#B5822F', '#5E4B8B', '#2F5D50'];

const getRandomAvatarColor = () => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin initialized)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    // Default role assignment safeguards
    const assignedRole = role && ['admin', 'it_manager', 'technician', 'employee', 'asset_manager'].includes(role) 
      ? role 
      : 'employee';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: assignedRole,
      department: department || null,
      avatarColor: getRandomAvatarColor(),
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(res, user._id);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account has been deactivated. Contact IT Administrator.');
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(res, user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token using httpOnly cookie or request body
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      res.status(401);
      throw new Error('Refresh token not found');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'servicedesk_jwt_refresh_secret_key_2026'
    );

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('Invalid session or user deactivated');
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarColor: user.avatarColor,
      },
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    res.status(401);
    next(new Error('Session expired. Please log in again.'));
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('department', 'name code');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
