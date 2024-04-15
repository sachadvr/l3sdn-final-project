const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

app.use(bodyParser.json())

const isGranted = (user, role) => {
  return user && user.role === role
}
const secretKey = 'ADZHUZAI123'
app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les utilisateurs' })
    }

    try {
      const users = JSON.parse(data)

      const user = users.find(u => u.username === username && u.password === password)

      if (user) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' })

        res.json({ user: { id: user.id, username: user.username, role: user.role }, token })
      } else {
        res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
      }
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les users' })
    }
  })
})

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (!token) {
    return res.status(403).json({ message: 'Aucun Bearer Token n\'a été fourni' })
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Echec de l\'authentification du token' })
    }

    req.user = decoded
    next()
  }
  )
}
app.post('/api/verifyToken', verifyToken, (req, res) => {
  res.json(req.user)
})

app.get('/api/users/:customId', verifyToken, (req, res) => {
  const customId = req.params.customId;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les utilisateurs' });
    }

    try {
      const users = JSON.parse(data);
      const user = users.find(u => {
        return u.id == customId;
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les utilisateurs' });
    }
  });
});
app.get('/api/users', verifyToken, (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les utilisateurs' })
    }

    try {
      const users = JSON.parse(data)

      const managerId = req.query.manager_id;
      if (isGranted(req.user, 'ROLE_RH')) {
        res.json(users.filter(u => u.role === 'ROLE_USER').map(u => ({ id: u.id, name: u.name, firstname: u.firstname })))
        return
      }
      if (managerId) {
        res.json(users.filter(u => u.manager_id == managerId).map(u => ({ id: u.id, name: u.name, firstname: u.firstname })))
        return
      }
      res.json(users.map(u => ({ username: u.username, role: u.role, manager_id: u.manager_id })))
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les utilisateurs' })
    }
  })
})

app.patch('/api/users/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUserData = req.body;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les utilisateurs' });
    }

    try {
      const users = JSON.parse(data);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const existingUser = users[userIndex];
      const updatedUser = { ...existingUser, ...updatedUserData };
      users[userIndex] = updatedUser;

      fs.writeFile('user.json', JSON.stringify(users), 'utf8', err => {
        if (err) {
          return res.status(500).json({ message: 'Impossible de mettre à jour l\'utilisateur' });
        }

        res.json(updatedUser);
      });
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les utilisateurs' });
    }
  });
});



const port = 3000
app.listen(port, () => {
  console.log(`Le backend est lancé sur http://localhost:${port} -> Proxy vers http://localhost:9000/api`)
})

app.get('/api/interviews/:userid', verifyToken, (req, res) => {
  fs.readFile('interviews.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les entretiens' })
    }

    try {
      const interviews = JSON.parse(data)
      console.log(interviews)
      res.json(interviews.filter(i => i.user_id == req.params.userid))
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les entretiens' })
    }
  })
})

app.post('/api/interviews/add-to-json', verifyToken, (req, res) => {
  fs.readFile('interviews.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Impossible de lire les entretiens' });
    }

    try {
      const interviews = JSON.parse(data);
      const newInterview = {
        id: req.body.id,
        user_id: req.body.user_id,
        date: req.body.date,
        resume: req.body.resume,
        created_at: new Date().toISOString(),
        manager_id: req.user.manager_id,
      };

      interviews.push(newInterview);

      fs.writeFile('interviews.json', JSON.stringify(interviews), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'entretien' });
        }

        res.status(200).json({ message: 'Entretien ajouté avec succès au fichier JSON' });
      });
    } catch (parseError) {
      res.status(500).json({ message: 'Impossible de lire les entretiens' });
    }
  });
});
