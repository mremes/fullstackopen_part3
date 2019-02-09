mongoose = require('mongoose')
uniqueValidator = require('mongoose-unique-validator');

const url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true }).then(result => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log('error connection to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        phone: { type: String, required: true }
    }
)

personSchema.path('name').validate((name) => name.length > 2)
personSchema.path('phone').validate((phone) => phone.length > 7)

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema) 