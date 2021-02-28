require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require ('morgan')
const Person = require('./models/person')

app.use(express.json())

app.use(express.static('build'))


let persons = [
      { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
        
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345",
        
      },
      { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        
      }
    ]
    
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
  }))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({}).then(count => {
       response.send(`<h4>Phonebook has information for ${count} people</h4> 
       <p>${new Date()}</p>`)
  })
  .catch(error => next(error))
})



app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

 //POST
app.post('/api/persons', (request, response, next) => {
  const body = request.body


  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if(persons.find(p => p.name.toLowerCase()=== body.name.toLowerCase())) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number 
  })
  
  person.save().then(result => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook.`)
  }) 

  .catch(error => next(error))

  persons = persons.concat(person)
  response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number 
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})