const express = require('express')
const router = express.Router()
const {getData, saveData} = require('../utils/fileUtils')

const isGranted = (user, role) => user && user.role === role

// GET all interviews or filter by manager_id
router.get('/', async (req, res) => {
  try {
    const data = await getData('interviews')
    if (req.query.manager_id) {
      const filteredData = data.filter(i => {
        return i.manager_id === parseInt(req.query.manager_id)
      })
      res.json(filteredData)
      return
    }
    res.json(data)

  } catch (error) {
    res.status(500).json({message: 'Échec de la récupération des entretiens', error: error.toString()})
  }
})

// GET interviews by user_id
router.get('/:userid', async (req, res) => {
  try {
    const data = await getData('interviews')
    const userInterviews = data.filter(i => i.user_id == req.params.userid)
    res.json(userInterviews)
  } catch (error) {
    res.status(500).json({message: 'Échec de la récupération des entretiens', error: error.toString()})
  }
})

// POST a new interview
// POST a new interview
router.post('/', async (req, res) => {
  try {
    const data = await getData('interviews')
    const {date, resume, user_id, manager_id, rating} = req.body

    if (!date || !resume || !user_id || !manager_id || !rating) {
      return res.status(400).json({message: 'Veuillez remplir tous les champs'})
    }
    let newInterview = {
      id: data.length + 1,
      date,
      resume,
      user_id,
      manager_id,
      rating
    }

    data.push(newInterview)

    if (await saveData('interviews', data)) {
      res.status(201).json(newInterview)
    } else {
      res.status(500).json({message: 'Failed to save new interview'})
    }
  } catch (error) {
    res.status(500).json({message: 'Failed to process request', error: error.message})
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const data = await getData('interviews')
    const interviewIndex = data.findIndex(i => i.id == req.params.id)

    if (interviewIndex === -1) {
      return res.status(404).json({message: 'Entretien non trouvé'})
    }

    const existingInterview = data[interviewIndex]
    const updatedInterview = {...existingInterview, ...req.body}
    data[interviewIndex] = updatedInterview

    if (await saveData('interviews', data)) {
      res.json(updatedInterview)
    } else {
      res.status(500).json({message: 'Failed to save interview'})
    }
  } catch (error) {
    res.status(500).json({message: 'Failed to process request', error: error.message})
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const data = await getData('interviews')
    const interviewIndex = data.findIndex(i => i.id == req.params.id)

    if (interviewIndex === -1) {
      return res.status(404).json({message: 'Entretien non trouvé'})
    }

    data.splice(interviewIndex, 1)

    if (await saveData('interviews', data)) {
      res.json({message: 'Entretien supprimé'})
    } else {
      res.status(500).json({message: 'Failed to save interviews'})
    }
  } catch (error) {
    res.status(500).json({message: 'Failed to process request', error: error.message})
  }
})

module.exports = router
