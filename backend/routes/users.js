const express = require('express');
const router = express.Router();
const { getData, saveData } = require('../utils/fileUtils');

const isGranted = (user, role) => user && user.role === role;

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
    console.log('bbbb');
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
    console.log('Data retrieved:', data);
    const userInterviews = data.filter(i => i.user_id == req.params.userid);
    console.log('Filtered data:', userInterviews);
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
router.post('/', async (req, res) => {
  console.log(req.body);  // Affiche les données reçues pour le débogage
  try {
    const data = await getData('interviews');
    // Vérifier si l'utilisateur a le droit d'ajouter un entretien (rôle admin ou manager)
    if (!isGranted(req.user, 'ROLE_ADMIN') && !isGranted(req.user, 'ROLE_MANAGER')) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à ajouter un nouvel entretien' });
    }
    const newInterview = { ...req.body, id: assignNewId(data) };
    // Si c'est un utilisateur régulier, attribuer automatiquement le manager de cet utilisateur
    if (isGranted(req.user, 'ROLE_USER')) {
      newInterview.manager_id = req.user.manager_id;
    } else {
      // Si c'est un admin ou un manager, vérifier si le champ "manager_id" est présent
      if (!newInterview.manager_id) {
        return res.status(400).json({ message: 'Le champ "manager_id" est requis pour un admin ou un manager' });
      }
    }
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
