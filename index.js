const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()
const errorHandler = require('./middleware/errorHandler')


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(errorHandler)

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const url = 'mongodb+srv://<USUARIO>:<CONTRASEÑA>@cluster0.njrlr4p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.use(express.static(path.resolve(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updatedPerson = {
    name,
    number,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
