mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('usage: <password> <name> <phone>')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb://pbadmin:${password}@ds113692.mlab.com:13692/hy-fullstack-phonebook`

const personSchema = new mongoose.Schema({ name: String, phone: String })
const Person = mongoose.model('Person', personSchema) 

console.log('connecting to mongodb...')
mongoose.connect(url, { useNewUrlParser: true }).then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

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
    console.log(`lisätään ${name} numero ${phone} luetteloon... `)

    newPerson.save().then(_ => {
        console.log('lisätty')
        mongoose.connection.close()
    })
} else {
    console.log(`
    usage: node mongo.js <password> <name> <phone> - save person doc
           node mongo.js <password>                – get all person docs
    `)
    exitCode = 1;
}