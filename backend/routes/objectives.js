const express = require('express');
const router = express.Router();
const { getData } = require('../utils/fileUtils');

// GET all objectives or filter by user_id and year
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

// GET objectives by userid, with optional year filter
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

module.exports = router;
