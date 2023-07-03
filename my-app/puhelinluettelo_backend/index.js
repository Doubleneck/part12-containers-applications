const express = require('express')
const morgan = require('morgan')
//const cors = require('cors') 
const app = express()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

//app.use(cors)
app.use(morgan(':method :url :status :response-time ms :person'),)


morgan.token('person', (request, response) => {
  return JSON.stringify(request.body)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    const size = persons.length
    const currentTimeInSeconds=new Date().toString()
    response.send(`<div>Phonebook has info for ${size} people</div> ${currentTimeInSeconds} <div> </div>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))  
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name)
  if (body.name === undefined || body.name.length <3 ) {
    return response.status(400).json({ error: 'name missing or too short'})
  } 
  const person = new Person ({
    name: body.name,
    number:body.number
  })

  console.log('newperson',person )
  person.save().then(savedPerson => { 
    console.log('person saved!')
    response.json(savedPerson)
  })  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = ({
    name: body.name, 
    number:body.number
  })

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
 
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)



