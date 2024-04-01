const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())

const secretKey = 'ADZHUZAI123'
app.post('/api/login', (req, res) => {
  const {username, password} = req.body

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({message: 'Impossible de lire les utilisateurs'})
    }

    try {
      const users = JSON.parse(data)

      const user = users.find(u => u.username === username && u.password === password)

      if (user) {
        const token = jwt.sign({id: user.id, username: user.username, role: user.role}, secretKey, {expiresIn: '1h'})

        res.json({user: {username: user.username, role: user.role}, token})
      } else {
        res.status(401).json({message: 'Nom d\'utilisateur ou mot de passe incorrect'})
      }
    } catch (parseError) {
      res.status(500).json({message: 'Impossible de lire les users'})
    }
  })
})

app.post('/api/verifyToken', (req, res) => {
  let token = req.headers['authorization']
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (!token) {
    return res.status(403).json({message: 'Aucun Bearer Token n\'a été fourni'})
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({message: 'Echec de l\'authentification du token'})
    }

    res.json(decoded)
  })
})


const port = 3000
app.listen(port, () => {
  console.log(`Le backend est lancé sur http://localhost:${port} -> Proxy vers http://localhost:9000/api`)
})
