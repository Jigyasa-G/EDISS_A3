// middleware/jwtAuth.js
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const clientType = req.headers['x-client-type'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    if (!clientType || !['iOS', 'Android'].includes(clientType)) {
      return res.status(400).json({ message: 'Invalid X-Client-Type header' });
    }

    if (!authHeader?.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }
    
  
    // Typically "Bearer <token>"
    const token = authHeader.split(' ')[1];
    // if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //   return res.status(401).json({ message: 'Invalid Authorization format' });
    // }
  
    // const token = parts[1];
    console.log("authHeader:", authHeader);
    console.log('Token:', token);
    try {
      // Decode the token payload (2nd part of the JWT)
      const payloadString = Buffer.from(token.split('.')[1], 'base64').toString();
      const decoded = JSON.parse(payloadString);

      console.log('Decoded token:', decoded);
  
      // Check required fields in payload
      const validSubjects = ['starlord', 'gamora', 'drax', 'rocket', 'groot'];
      if (!decoded.sub || !validSubjects.includes(decoded.sub)) {
        return res.status(401).json({ message: 'Invalid sub in token' });
      }
      if (decoded.iss !== 'cmu.edu') {
        return res.status(401).json({ message: 'Invalid iss in token' });
      }
      if (!decoded.exp || decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ message: 'Token is expired' });
      }
  
      // If all checks pass, attach user info to req and proceed
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  