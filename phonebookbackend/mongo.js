const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}


const password = process.argv[2]


if (process.argv.length === 5) {
  const name =  process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number 
  })
  
  person.save().then(result => {
    console.log(`Added ${name} with number ${number} to phonebook.`)
    mongoose.connection.close()
  }) 
}
else if (process.argv.length === 3) {
  console.log ('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })
}
else {
mongoose.connection.close()
console.log('Wrong amount of arguments')
process.exit(1)
}