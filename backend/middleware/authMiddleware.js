// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = 'ADZHUZAI123';

const authMiddleware = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Echec de l\'authentification du token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(403).json({ message: 'Aucun Bearer Token n\'a été fourni' });
  }
};

module.exports = authMiddleware;
