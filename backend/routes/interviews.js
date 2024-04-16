const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

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
        res.status(500).json({ message: 'Échec de la récupération des entretiens', error: error.toString() });
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
            res.status(404).json({ message: 'Aucun entretien trouvé pour cet utilisateur' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Échec de la récupération des entretiens', error: error.toString() });
    }
});

// POST a new interview
// POST a new interview
router.post('/', async (req, res) => {
    try {
        const data = await getData('interviews');
        const { date, resume } = req.body;
        const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir des informations d'authentification
        const manager_id = req.user.manager_id; // Récupérer l'ID du manager de l'utilisateur à partir des informations d'authentification
        const created_at = new Date().toISOString(); // Obtenir la date de création au format ISO

        const newInterview = {
            id: data.length + 1,
            user_id,
            date,
            resume,
            created_at,
            manager_id
        };

        data.push(newInterview);

        if (await saveData('interviews', data)) {
            res.status(201).json(newInterview);
        } else {
            res.status(500).json({ message: 'Failed to save new interview' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to process request', error: error.message });
    }
});


module.exports = router;
