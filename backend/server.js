const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const loginRoutes = require('./routes/login');
const interviewsRoutes = require('./routes/interviews');
const objectivesRoutes = require('./routes/objectives');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/interviews', authMiddleware, interviewsRoutes);
app.use('/api/objectives', authMiddleware, objectivesRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
