if (process.env.NODE_ENV !== 'production')
  require('dotenv').config()

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  // eslint-disable-next-line no-console
  console.log('usage: <password> <name> <phone>')
  process.exit(1)
}

const url = process.env.DB_URL_TEMPLATE.replace('PASSWORD', process.argv[2])

const personSchema = new mongoose.Schema({ name: String, phone: String })
const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-console
console.log('connecting to mongodb...')
mongoose.connect(url, { useNewUrlParser: true }).then(() => {
  // eslint-disable-next-line no-console
  console.log('connected to MongoDB')
})
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('error connection to MongoDB:', error.message)
  })

if (process.argv.length == 3) {
  Person.find({}).then(persons => {
    // eslint-disable-next-line no-console
    console.log('puhelinluettelo:')
    // eslint-disable-next-line no-console
    persons.forEach(p => console.log(`${p.name} ${p.phone}`))
    mongoose.connection.close()
  })
} else if (process.argv.length == 5) {
  const name = process.argv[3]
  const phone = process.argv[4]

  const newPerson = new Person({ name, phone })
  // eslint-disable-next-line no-console
  console.log(`lisätään ${name} numero ${phone} luetteloon... `)

  newPerson.save().then(() => {
    // eslint-disable-next-line no-console
    console.log('lisätty')
    mongoose.connection.close()
  })
} else {
  // eslint-disable-next-line no-console
  console.log(`
    usage: node mongo.js <password> <name> <phone> - save person doc
           node mongo.js <password>                – get all person docs
    `)
}