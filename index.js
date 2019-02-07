const express = require('express')
const app = express()

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

app.get('/api/persons', (_, res) => {
    res.json(persons)
})

app.get('/info', (_, res) => {
    res.send(`
    Puhelinluettelossa on ${persons.length} henkilön tiedot.<br>
    ${new Date()}
    `)
})

app.get('/api/persons/:id', (req, res) => {
    let id = Number(req.params.id)
    let element = persons.find(e => e.id === id)
    if (element) return res.json(element)
    res.status(404).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})