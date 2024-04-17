const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

const assignNewId = (data) => {
  if (data.length === 0) return 1;
  const maxId = Math.max(...data.map(item => item.id));
  return maxId + 1;
};

router.get('/', async (req, res) => {
    const managerId = req.query.manager_id;
    const data = await getData('users', res);

    if (req.query.role) {
        return res.json(data.filter(u => u.role === req.query.role));
    }

    if (isGranted(req.user, 'ROLE_RH')) {
        return res.json(data.filter(u => u.role === 'ROLE_USER').map(u => ({ id: u.id, name: u.name, firstname: u.firstname, job: u.job, salary: u.salary })));
    }

    if (managerId) {
        return res.json(data.filter(u => u.manager_id == managerId).map(u => ({ id: u.id, name: u.name, firstname: u.firstname, job: u.job, salary: u.salary })));
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

router.post('/', async (req, res) => {
  const data = await getData('users', res);
  const newUser = { id: assignNewId(data), ...req.body };
  data.push(newUser);

  if (await saveData('users', data, res)) {
    res.json(newUser);
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const data = await getData('users', res);
  const userIndex = data.findIndex(u => u.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  data.splice(userIndex, 1);

  if (await saveData('users', data, res)) {
    res.json({ message: 'Utilisateur supprimé' });
  }
});


module.exports = router;
