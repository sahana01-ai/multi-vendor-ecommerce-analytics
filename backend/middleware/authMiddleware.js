const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('--- AUTH CHECK ---');
  console.log('Received header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Handles any number of spaces after "Bearer"
  const token = authHeader.replace('Bearer', '').trim();
  console.log('Extracted token:', token);
  console.log('JWT_SECRET in use:', process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('JWT verify FAILED:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};