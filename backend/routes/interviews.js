const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');  // Ensure these are correctly implemented

// Helper to assign new ID
const assignNewId = (data) => {
    if (data.length === 0) return 1;
    const maxId = Math.max(...data.map(item => item.id));
    return maxId + 1;
};

// GET all interviews or filter by manager_id
router.get('/', async (req, res) => {
    try {
        const data = await getData('interviews');
        if (req.query.manager_id) {
            const filteredData = data.filter(i => i.manager_id === req.query.manager_id);
            res.json(filteredData);
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve interviews', error: error.toString() });
    }
});

// GET interviews by user_id
router.get('/:userid', async (req, res) => {
    try {
        const data = await getData('interviews');
        const userInterviews = data.filter(i => i.user_id == req.params.userid);
        if (userInterviews.length > 0) {
            res.json(userInterviews);
        } else {
            res.status(404).json({ message: 'No interviews found for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve interviews', error: error.toString() });
    }
});

// POST a new interview
router.post('/', async (req, res) => {
    try {
        const data = await getData('interviews');
        const newInterview = {
            ...req.body,
            id: assignNewId(data)
        };
        data.push(newInterview);
        if (await saveData('interviews', data)) {
            res.status(201).json(newInterview);
        } else {
            res.status(500).json({ message: 'Failed to save new interview' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to process request', error: error.toString() });
    }
});

module.exports = router;
