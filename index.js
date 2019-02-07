const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.json())

morgan.token('body', (req, _) => {
    if (req.method == 'POST') return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "phone": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "phone": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "phone": "040-123456",
        "id": 4
    }
]

app.get('/api/persons', (_, res) => res.json(persons))

app.get('/info', (_, res) =>
    res.send(`
    Puhelinluettelossa on ${persons.length} henkilön tiedot.<br>
    ${new Date()}
    `)
)


const get_person_with_raw_id = (raw_id) => {
    let id = Number(raw_id)
    return persons.find(e => e.id === id)
}

app.get('/api/persons/:id', (req, res) => {
    let element = get_person_with_raw_id(req.params.id)
    if (element) return res.json(element)
    res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    let element = get_person_with_raw_id(req.params.id)

    if (element) {
        persons = persons.filter(e => e.id !== element.id)
        res.status(200).end()
    }

    res.status(404).end()
})

const response400 = (res, error) => res.status(400).json({ error })
const random = () => Math.floor(Math.random() * 1611623773)

app.post('/api/persons', (req, res) => {
    const newPerson = Object.assign({}, req.body)
    const error = (msg) => response400(res, msg)

    if (!newPerson.name)
        return error('name is missing')
    else if (!newPerson.phone)
        return error('phone is missing')
    else if (persons.find(e => e.name === newPerson.name))
        return error('name must be unique')

    newPerson.id = random()
    persons = persons.concat(newPerson)
    res.status(200).end()
});

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})