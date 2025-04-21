module.exports = (req, res, next) => {
    
    // Check for X-Client-Type header
    const clientType = req.header('X-Client-Type');
    if (!clientType) {
        return res.status(400).json({ message: 'Missing X-Client-Type header' });
    }
    
    //Check for Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }
  
    // Typically "Bearer <token>"
    const parts = authHeader.split(' ');
    // if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //   return res.status(401).json({ message: 'Invalid Authorization format' });
    // }
  
    const token = parts[1];
    try {
      // Decode the token payload (the 2nd part of the JWT)
      const payloadString = Buffer.from(token.split('.')[1], 'base64').toString();
    //   'utf8'
      const decoded = JSON.parse(payloadString);
        console.log(decoded);
      // Check required fields in payload
      const validSubjects = ['starlord', 'gamora', 'drax', 'rocket', 'groot'];
      if (!decoded.sub || !validSubjects.includes(decoded.sub)) {
        return res.status(401).json({ message: 'Invalid sub in token' });
      }
      if (!decoded.iss || decoded.iss !== 'cmu.edu') {
        console.log(decoded.iss);
        return res.status(401).json({ message: 'Invalid iss in token' });
      }
      if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({ message: 'Token is expired' });
      }
      console.log('Decoded token:', decoded);

      // Attach the decoded token to the request for further use
      req.user = decoded;
      next();
    } catch (error) {
        // res.status('Error decoding token:', error);
      return res.status(401).json({ message:  error.message });
    }
  };
  