const express = require('express');
const router = express.Router();
const { getData } = require('../utils/fileUtils');


router.get('/', async (req, res) => {
    const data = await getData('interviews', res);

    if (req.query.manager_id) {
        res.json(data.filter(i => i.manager_id == req.query.manager_id));
        return;
    }
    res.json(data);
});

router.get('/:userid', async (req, res) => {
    const data = await getData('interviews', res);
    res.json(data.filter(i => i.user_id == req.params.userid));
});


router.post('/', async (req, res) => {
    const data = await getData('interviews', res);
    data.push(req.body);
    
    res.json(data);
});

module.exports = router;
