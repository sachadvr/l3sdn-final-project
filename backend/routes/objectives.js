const express = require('express');
const router = express.Router();
const { getData } = require('../utils/fileUtils');


router.get('/', async (req, res) => {
    const data = await getData('objectifs', res);

    res.json(data);
});

router.get('/:userid', async (req, res) => {
    const data = await getData('objectifs', res);

  if (req.query.year) {
    res.json(data.filter(i => i.user_id == req.params.userid && i.date.startsWith(req.query.year)))
    return
  }
    res.json(data.filter(i => i.user_id == req.params.userid));
});


module.exports = router;
