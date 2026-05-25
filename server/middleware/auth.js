const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Look for the token
  const authHeader = req.header('Authorization');
  
  // If there's no header, or it doesn't start with 'Bearer ', reject them
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // If the check fails or the token is expired, this throws an error and jumps to the catch block
    const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's ID to the request so the next route knows whose data to load
    req.user = verifiedPayload; 
    
    // Open sesame(lol)! 
    // The user is authenticated, so we let them through to the next middleware or route handler
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};