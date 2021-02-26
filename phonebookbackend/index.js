const express = require('express')
const app = express()
const morgan = require ('morgan')

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

app.get('/info', (request, response) => {
    response.send(`<h1>Info</h1>
    <p>Phonebook has information about ${persons.length}people.</p>
    <p>${new Date()}</p>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  
  return Math.floor(Math.random() * 1000000 )
}

 //POST
app.post('/api/persons', (request, response) => {
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})
 
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})