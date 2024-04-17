const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

// Helper to assign new ID
const assignNewId = (data) => {
  if (data.length === 0) return 1;
  const maxId = Math.max(...data.map(item => item.id));
  return maxId + 1;
};

router.get('/', async (req, res) => {
    const managerId = req.query.manager_id;
    const data = await getData('users', res);

    if (isGranted(req.user, 'ROLE_RH')) {
        return res.json(data.filter(u => u.role === 'ROLE_USER').map(u => ({ id: u.id, name: u.name, firstname: u.firstname, job: u.job})));
    }

    if (managerId) {
        return res.json(data.filter(u => u.manager_id == managerId).map(u => ({ id: u.id, name: u.name, firstname: u.firstname, job: u.job})));
    }

    res.json(data.map(u => ({ id: u.id, username: u.username, role: u.role, manager_id: u.manager_id, name: u.name, firstname: u.firstname, job: u.job })));
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await getData('users', res);
  const user = data.find(u => u.id == id);

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await getData('users', res);
  const userIndex = data.findIndex(u => u.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const existingUser = data[userIndex];
  const updatedUser = { ...existingUser, ...req.body };
  data[userIndex] = updatedUser;

  if (await saveData('users', data, res)) {
    res.json(updatedUser);
  }
});


module.exports = router;
