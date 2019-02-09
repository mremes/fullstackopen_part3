require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', (req, _) => {
    if (req.method == 'POST') return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (_, res) => {
    Person.find({}).then(coll => res.json(coll.map(element => { return { id: element.id, name: element.name, phone: element.phone } })))
})

app.get('/info', (_, res) => {
    const infoString = (coll) => `Puhelinluettelossa on ${coll.length} henkilön tiedot.<br>${new Date()}`
    Person.find({}).then(coll => res.send(infoString(coll)))
})


app.get('/api/persons/:id', (req, res) => {
    Person.findOne({ id: req.params.id }).then(element => {
        console.log(element)
        if (element) return res.json({ id: element.id, name: element.name, phone: element.phone })
        res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findOne({ id: req.params.id }).then(elem => {
        if (elem) {
            Person.deleteOne(elem).then(_ => res.status(200).end())
        } else {
            return res.status(404).end()
        }
    });
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
    Person.find({ name: person.name }).then(e => {
        const newPerson = new Person({ ...person, id: random() })
        newPerson.save()
            .then(p => {
                return res.status(200).end()
            }).catch(error => {
                console.log(error.message, error.name, error.kind)
                next(error)
            })
    })
});

app.put('/api/persons', (req, res) => {
    const person = Object.assign({}, req.body)
    Person.findOne({ id: person.id }).then(e => {
        e.phone = person.phone
        e.save()
    })
})

/* MIDDLEWARE HANDLING UNKNOWN ENDPOINTS */

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ message: 'malformatted id' })
    } else if (error.name == 'ValidationError' && error.message.includes('name` to be unique')) {
        return response.status(400).send({ message: 'there is already a person with given name' })
    } else if (error.name == 'ValidationError' && error.message.includes('for path `phone')) {
        return response.status(400).send({ message: 'phone must be at least 8 characters'})
    } else if (error.name == 'ValidationError' && error.message.includes('for path `name')) {
        return response.status(400).send({ message: 'name must be at least 3 characters'})
    }

    next(error)
}

app.use(errorHandler)

/* RUN APP */

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})