const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const handleError = (res, message, error = {}) => res.status(500).json({ message, error: error.message });
const isGranted = (user, role) => user && user.role === role;

router.get('/', async (req, res) => {
  try {
    const data = await getData('interviews');

    if (isGranted(req.user, 'ROLE_RH')) {
      return res.json(data);
    }
    const { manager_id } = req.query;
    const result = manager_id ? data.filter(i => i.manager_id === parseInt(manager_id)) : data;
    res.json(result);
  } catch (error) {
    handleError(res, 'Échec de la récupération des entretiens', error);
  }
});

router.get('/:userid', async (req, res) => {
  try {
    const data = await getData('interviews');
    const userInterviews = data.filter(i => i.user_id == req.params.userid);
    res.json(userInterviews);
  } catch (error) {
    handleError(res, 'Échec de la récupération des entretiens', error);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await getData('interviews');
    const { date, resume, user_id, manager_id, rating } = req.body;
    if (!date || !resume || !user_id || !manager_id || !rating) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    let newInterview = {
      id: data.length + 1,
      date, resume, user_id, manager_id, rating
    };

    data.push(newInterview);
    await saveData('interviews', data);
    res.status(201).json(newInterview);
  } catch (error) {
    handleError(res, 'Failed to save new interview', error);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = await getData('interviews');
    const index = data.findIndex(i => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }

    data[index] = { ...data[index], ...req.body };
    await saveData('interviews', data);
    res.json(data[index]);
  } catch (error) {
    handleError(res, 'Failed to save interview', error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await getData('interviews');
    const index = data.findIndex(i => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Entretien non trouvé' });
    }

    data.splice(index, 1);
    await saveData('interviews', data);
    res.json({ message: 'Entretien supprimé' });
  } catch (error) {
    handleError(res, 'Failed to save interviews', error);
  }
});

module.exports = router;
