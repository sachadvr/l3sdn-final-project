const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

// Helper function to send error messages
const handleError = (res, message, error = {}) => res.status(500).json({ message, error: error.message });

// GET all interviews or filter by manager_id
router.get('/', async (req, res) => {
  try {
    const data = await getData('interviews');
    const { manager_id } = req.query;
    const result = manager_id ? data.filter(i => i.manager_id === parseInt(manager_id)) : data;
    res.json(result);
  } catch (error) {
    handleError(res, 'Échec de la récupération des entretiens', error);
  }
});

// GET interviews by user_id
router.get('/:userid', async (req, res) => {
  try {
    const data = await getData('interviews');
    const userInterviews = data.filter(i => i.user_id == req.params.userid);
    res.json(userInterviews);
  } catch (error) {
    handleError(res, 'Échec de la récupération des entretiens', error);
  }
});

// POST a new interview
router.post('/', async (req, res) => {
  try {
    const data = await getData('interviews');
    const { date, resume, user_id, manager_id, rating } = req.body;
    if (!date || !resume || !user_id || !manager_id || !rating) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    let newInterview = {
      id: data.length + 1, // Consider using UUIDs for better scalability and uniqueness
      date, resume, user_id, manager_id, rating
    };

    data.push(newInterview);
    await saveData('interviews', data);
    res.status(201).json(newInterview);
  } catch (error) {
    handleError(res, 'Failed to save new interview', error);
  }
});

// PATCH update an interview
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

// DELETE an interview
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
