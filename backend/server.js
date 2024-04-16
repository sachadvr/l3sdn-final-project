const express = require('express');
require('dotenv').config();
const app = express();

// Middleware
const authMiddleware = require('./middleware/authMiddleware');

// Importation des routes
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const interviewsRoutes = require('./routes/interviews');
const objectivesRoutes = require('./routes/objectives');

// Middleware pour l'analyse JSON
app.use(express.json());

// Routage
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/interviews', authMiddleware, interviewsRoutes);
app.use('/api/objectives', authMiddleware, objectivesRoutes);

// Configuration du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});
