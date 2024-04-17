const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const filterDataByUserAndYear = (data, userId, year) => {
  let filteredData = data.filter(o => o.user_id == userId);
  if (year) {
    filteredData = filteredData.filter(o => o.date.startsWith(year));
  }
  return filteredData;
};

router.get('/', async (req, res) => {
  try {
    const { userid, year } = req.query;
    const data = await getData('objectifs');
    let responseData = data;
    if (userid) {
      responseData = filterDataByUserAndYear(data, userid, year);
    }
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve objectives', error: error.message });
  }
});

router.get('/:userid', async (req, res) => {
  const { userid } = req.params;
  const { year } = req.query;

  try {
    const data = await getData('objectifs');
    const userObjectifs = filterDataByUserAndYear(data, userid, year);
    res.json(userObjectifs);
  } catch (error) {
    res.status(404).json({ message: 'Objectives not found for this user', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const data = await getData('objectifs');
    const index = data.findIndex(i => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: `Objectif with id ${req.params.id} not found` });
    }

    data[index] = { ...data[index], ...req.body };
    await saveData('objectifs', data);
    res.json(data[index]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update objective', error: error.message });
  }
});

router.get('/manager/:managerid/:year', async (req, res) => {
  const { managerid, year } = req.params;

  try {
    const data = await getData('objectifs');
    const managerObjectifs = data.filter(o => o.manager_id == managerid && o.date.startsWith(year));
    res.json(managerObjectifs);
  } catch (error) {
    res.status(404).json({ message: 'Objectives not found for this manager', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { date, resume, user_id, manager_id } = req.body;

  try {
    if (!date || !resume || !user_id || !manager_id) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    const data = await getData('objectifs');
    let newObjective = { id: data.length + 1, date, resume, user_id, manager_id };
    data.push(newObjective);

    await saveData('objectifs', data);
    res.status(201).json(newObjective);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save new objective', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await getData('objectifs');
    const index = data.findIndex(i => i.id == req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: `Objectif with id ${req.params.id} not found` });
    }

    data.splice(index, 1);
    await saveData('objectifs', data);
    res.json({ message: `Objectif with id ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete objective', error: error.message });
  }
});

module.exports = router;
