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
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})