const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = args[2]

const url = 'mongodb+srv://<USUARIO>:<CONTRASEÑA>@cluster0.njrlr4p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args.length === 3) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(err => {
      console.log(err)
      mongoose.connection.close()
    })
} else if (args.length === 5) {
 
  const name = args[3]
  const number = args[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(err => {
      console.log(err)
      mongoose.connection.close()
    })
} else {
  console.log('Invalid number of arguments')
  process.exit(1)
}
