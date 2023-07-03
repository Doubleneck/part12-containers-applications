require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
//const password = process.argv[2] 
//const url =
//    `mongodb+srv://fullstack:${password}@andysfs2022.1rjadhh.mongodb.net/personApp?retryWrites=true&w=majority`

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
  


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)