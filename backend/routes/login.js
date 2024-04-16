const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { getData } = require('../utils/fileUtils');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
router.use(bodyParser.json());

const secretKey = 'ADZHUZAI123';

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const data = await getData('users', res);

  if (data) {

  const user = data.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });
    res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
  } else {
    res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
  }
  }

});

router.post('/verify', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
