import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Protect routes - JWT verification
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'servicedesk_jwt_access_secret_key_2026'
      );

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        res.status(401);
        throw new Error('User not found or account deactivated');
      }

      if (!user.isActive) {
        res.status(403);
        throw new Error('Account deactivated. Contact system admin.');
      }

      req.user = user;
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed or expired'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

// Require specific role(s) middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Access denied. Role '${req.user.role}' is not authorized for this resource. Required: [${roles.join(', ')}]`)
      );
    }
    next();
  };
};

// Department scoping query helper middleware
export const departmentScope = (req, res, next) => {
  if (!req.user) return next();

  // Admin sees all departments
  if (req.user.role === 'admin') {
    req.departmentFilter = {};
  } else {
    // Other roles filter by their assigned department if set
    req.departmentFilter = req.user.department ? { department: req.user.department } : {};
  }
  next();
};
