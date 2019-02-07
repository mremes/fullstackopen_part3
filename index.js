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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})