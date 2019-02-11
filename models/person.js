const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  }
)

personSchema.path('name').validate((name) => name.length > 2)
personSchema.path('phone').validate((phone) => phone.length > 7)

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)