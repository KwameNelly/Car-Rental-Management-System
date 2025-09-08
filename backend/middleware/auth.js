const jwt = require('jsonwebtoken');

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      error: 'No token provided'
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
    
    next(); // Continue to the next middleware/route
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        error: 'Please login again'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token',
      error: 'Token verification failed'
    });
  }
};

/**
 * Admin-only middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'Please login first'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      error: 'Insufficient permissions'
    });
  }

  next();
};

/**
 * User can access their own data or admin can access any
 */
const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'Please login first'
    });
  }

  const resourceUserId = parseInt(req.params.id || req.params.user_id);
  
  if (req.user.role === 'admin' || req.user.id === resourceUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
      error: 'You can only access your own data'
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnerOrAdmin,
  JWT_SECRET
};

