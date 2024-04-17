const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { getData } = require('../utils/fileUtils');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(express.json());

const secretKey = 'ADZHUZAI123';

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await getData('users');
    const user = data.find(u => u.username === username && u.password === password);
    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        secretKey,
        { expiresIn: '1h' }
      );

      res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
    } else {
      res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données utilisateur', error: error.message });
  }
});

router.post('/verify', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
