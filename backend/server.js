const express = require('express');
const app = express();

const authMiddleware = require('./middleware/authMiddleware');

const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const interviewsRoutes = require('./routes/interviews');
const objectivesRoutes = require('./routes/objectives');

app.use(express.json());

app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/interviews', authMiddleware, interviewsRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/objectives', authMiddleware, objectivesRoutes);

app.listen(3000, () => {
  console.log('Le serveur fonctionne sur le port 3000');
});
