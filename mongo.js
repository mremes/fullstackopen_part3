mongoose = require('mongoose')



if (process.argv.length < 3) {
    console.log('usage: <password> <name> <phone>')
    process.exit(1)
}

password = process.argv[2]

const url = `mongodb://pbadmin:${password}@ds113692.mlab.com:13692/hy-fullstack-phonebook`

const personSchema = new mongoose.Schema({ name: String, phone: String })
const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, { useNewUrlParser: true })

if (process.argv.length == 3) {
    Person.find({}).then(persons => {
        console.log('puhelinluettelo:')
        persons.forEach(p => console.log(`${p.name} ${p.phone}`))
        mongoose.connection.close()
    })
} else if (process.argv.length == 5) {

    name = process.argv[3]
    phone = process.argv[4]

    const newPerson = new Person({ name, phone })
    process.stdout.write(`lisätään ${name} numero ${phone} luetteloon... `)

    newPerson.save().then(response => {
        console.log('lisätty.')
        mongoose.connection.close()
    })
} else {
    console.log(`
    usage: node mongo.js <password> <name> <phone> - save person doc
           node mongo.js <password>                – get all person docs
    `)
    mongoose.connection.close()
    process.exit(1)
}