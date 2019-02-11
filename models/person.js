const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.path('name').validate(name => name.length > 2)
personSchema.path('phone').validate(phone => phone.length > 7)

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)