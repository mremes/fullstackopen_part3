/* USE DOTENV IN DEV */
if (process.env.NODE_ENV !== 'production')
  require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


/* APP CONFIGURATION */
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', (req) => {
  if (req.method == 'POST')
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* ENDPOINTS */

app.get('/api/persons', (_, res) => Person.find({}).then(coll => res.json(coll.map(c => c.toJSON()))))

app.get('/info', (_, res) => {
  const infoString = (coll) => `Puhelinluettelossa on ${coll.length} henkilön tiedot.<br>${new Date()}`
  Person.find({}).then(coll => res.send(infoString(coll)))
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(elem => {
    if (elem)
      return res.json(elem.toJSON())
    return res.status(404).end()
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(elem => {
    if (elem)
      Person.deleteOne(elem).then(() => res.status(200).end())
    else return res.status(404).end()
  })
})

const response400 = (res, error) => res.status(400).json({ error })
const random = () => Math.floor(Math.random() * 1611623773)

app.post('/api/persons', (req, res, next) => {
  const person = Object.assign({}, req.body)
  const error = (msg) => response400(res, msg)

  if (!person.name)
    return error('name is missing')
  else if (!person.phone)
    return error('phone is missing')

  Person.findOne({ name: person.name }).then(elem => {
    if (elem) return error('already exists')
    const newPerson = new Person({ ...person, id: random() })
    newPerson.save()
      .then(() => {
        return res.json(newPerson).status(200).end()
      }).catch(error => {
        next(error)
      })
  })
})

app.put('/api/persons', (req, res, next) => {
  const person = Object.assign({}, req.body)
  Person.findOne({ id: person.id }).then(e => {
    e.name = person.name
    e.phone = person.phone
    e.save()
    return res.status(200).end()
  }).catch(error => {
    next(error)
  })
})

/* MIDDLEWARE HANDLING UNKNOWN ENDPOINTS */

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind == 'ObjectId')
    return response.status(400).send({ message: 'malformatted id' })
  else if (error.name == 'ValidationError' && error.message.includes('name` to be unique'))
    return response.status(400).send({ message: 'there is already a person with given name' })
  else if (error.name == 'ValidationError' && error.message.includes('for path `phone'))
    return response.status(400).send({ message: 'phone must be at least 8 characters' })
  else if (error.name == 'ValidationError' && error.message.includes('for path `name'))
    return response.status(400).send({ message: 'name must be at least 3 characters' })

  next(error)
}

app.use(errorHandler)

/* RUN APP */

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  /* eslint no-console: 0 */
  console.log(`Running server on port ${PORT}`)
})