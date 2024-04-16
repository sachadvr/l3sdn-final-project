const express = require('express');
const router = express.Router();
const { getData, writeData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

router.get('/', async (req, res) => {
  const { manager_id } = req.query;
  const data = await getData('users', res);

  if (isGranted(req.user, 'ROLE_RH')) {
    return res.json(data.filter(u => u.role === 'ROLE_USER').map(u => ({ id: u.id, name: u.name, firstname: u.firstname })));
  }

  if (manager_id) {
    return res.json(data.filter(u => u.manager_id == manager_id).map(u => ({ id: u.id, name: u.name, firstname: u.firstname })));
  }

  res.json(data.map(u => ({ id: u.id, username: u.username, role: u.role, manager_id: u.manager_id })));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await getData('users', res);
  const user = data.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await getData('users', res);
  const userIndex = data.findIndex(u => u.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const existingUser = data[userIndex];
  const updatedUser = { ...existingUser, ...req.body };
  data[userIndex] = updatedUser;

  if (await writeData('users', data, res)) {
    res.json(updatedUser);
  }
});

module.exports = router;
