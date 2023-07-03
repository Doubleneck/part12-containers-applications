import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [updateMessage, setUpdateMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  console.log('render', persons.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (personNames.includes(newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const foundObject =persons.filter(person => person.name === newName)[0]
        console.log(foundObject.id)
        
        personService
          .update(foundObject.id,personObject)
           .then(response => {
            setUpdateMessage(
              `Added a new number ${newNumber} for ${newName} `
            )
            setTimeout(() => {
              setUpdateMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== foundObject.id ? person : response.data))
            })
            .catch(error => {
              setErrorMessage(
                `Information of ${foundObject.name} has already been removed from the server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== foundObject.id))
              })
            
      } 
    } else {
    personService
      .create(personObject)
      .then(response => {
        setUpdateMessage(
          `Added ${newName} `
        )
        setTimeout(() => {
          setUpdateMessage(null)
        }, 5000)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const removePerson = (event) => {
    event.preventDefault()
    const person =  persons.filter(person => person.id.toString() === event.target.value.toString())[0]
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(event.target.value)
        .then(() => {
          setUpdateMessage(
            `Removed ${person.name} from phonebook `
          )
          setTimeout(() => {
            setUpdateMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id.toString() !== event.target.value))
      })
    } 
  }
  const personNames = persons.map(person => person.name)
  const personsToShow = showAll
    ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    : persons
    // console.log(persons.filter(person => person.name.includes(newFilter.toLowerCase())))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)   
  }
 
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter = {newFilter} handleFilterChange = {handleFilterChange} />
      <h2>add a new</h2>
      <SuccessNotification message={updateMessage} />
      <ErrorNotification message={errorMessage} />
      < PersonForm addPerson={addPerson} newName = {newName }newNumber = {newNumber} handleNameChange={handleNameChange}
      handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <ul>
      <Persons personstoShow = {personsToShow} removePerson = {removePerson}/> 
      </ul>
    </div>
  )
}

const Person = ({person,removePerson}) => {
  return(
    <div>
      {person.name} {person.number}    
      <button value = {person.id} onClick={removePerson}>
        delete 
      </button>
    </div>
  )
}

const Persons = ({personstoShow,removePerson}) => {
  return(
    <div>
    {personstoShow.map(person => <ul style={{padding:0}} key = {person.id}><Person person={person} removePerson={removePerson}
    />
    </ul>)} 
    </div>
  )
}

const PersonForm = (props) => {
  return(
    <div>
     <form onSubmit={props.addPerson}>
        <div> name: <input value={props.newName} onChange={props.handleNameChange}/></div>
        <div> number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div> 
        <button type="submit">add</button>
      </form>
    </div>
  )
}

const Filter = (props) => {
  return(
  <div> filter shown with: <input value={props.newFilter} onChange={props.handleFilterChange}/></div>
  )
}

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="update">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App