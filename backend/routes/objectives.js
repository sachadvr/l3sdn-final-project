const express = require('express');
const router = express.Router();
const { getData,saveData } = require('../utils/fileUtils');


router.get('/', async (req, res) => {
  try {
    const data = await getData('objectifs', res);
    if (req.query.userid) {
      let filteredData = data.filter(o => o.user_id === req.query.userid);
      if (req.query.year) {
        filteredData = filteredData.filter(o => o.date.startsWith(req.query.year));
      }
      res.json(filteredData);
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve objectives', error: error.message });
  }
});

router.get('/:userid', async (req, res) => {
  try {
    const data = await getData('objectifs', res);
    let userObjectifs = data.filter(o => o.user_id === req.params.userid);
    if (req.query.year) {
      userObjectifs = userObjectifs.filter(o => o.date.startsWith(req.query.year));
    }
    res.json(userObjectifs);
  } catch (error) {
    res.status(404).json({ message: 'Objectives not found for this user', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  const data = await getData('objectifs', res);

    const index = data.findIndex(i => i.id == req.params.id);
    if (index === -1) {
        res.status(404).json({ message: `Objectif with id ${req.params.id} not found` });
        return;
    }

    data[index] = { ...data[index], ...req.body };
    saveData('objectifs', data, res);
    res.json(data[index]);
});

module.exports = router;
