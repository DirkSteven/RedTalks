import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, 'app');
    req.user = decoded;  // Attach user data to the request object
    next();  // Continue to the next middleware/handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}
