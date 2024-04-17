const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

const assignNewId = (data) => {
  return data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
};

router.get('/', async (req, res) => {
  try {
    const { role, manager_id } = req.query;
    const data = await getData('users');

    if (role) {
      return res.json(data.filter(u => u.role === role));
    }

    if (isGranted(req.user, 'ROLE_RH')) {
      return res.json(data.filter(u => u.role === 'ROLE_USER').map(u => ({
        id: u.id, name: u.name, firstname: u.firstname, job: u.job, salary: u.salary
      })));
    }

    if (manager_id) {
      return res.json(data.filter(u => u.manager_id == manager_id).map(u => ({
        id: u.id, name: u.name, firstname: u.firstname, job: u.job, salary: u.salary
      })));
    }

    res.json(data.map(u => ({
      id: u.id, username: u.username, role: u.role, manager_id: u.manager_id,
      name: u.name, firstname: u.firstname, job: u.job
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await getData('users');
    const user = data.find(u => u.id == req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = await getData('users');
    const userIndex = data.findIndex(u => u.id == req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    data[userIndex] = { ...data[userIndex], ...req.body };
    await saveData('users', data);
    res.json(data[userIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await getData('users');
    const newUser = { id: assignNewId(data), ...req.body };
    data.push(newUser);

    await saveData('users', data);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save new user', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await getData('users');
    const userIndex = data.findIndex(u => u.id == req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    data.splice(userIndex, 1);
    await saveData('users', data);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;
