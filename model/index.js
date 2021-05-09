const fs = require('fs/promises')
// const contacts = require('./contacts.json')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    return contacts
  } catch (error) {
    console.log(error.message)
  }
}

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8')
    const contacts = JSON.parse(data)
    const contactById = contacts.find(contact => contact.id === Number(contactId))
    return contactById
  } catch (error) {
    console.log(error.message)
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const filteredContacts = contacts.filter(contact => contact.id !== Number(contactId))
    const contactsList = JSON.stringify(filteredContacts, null, 2)
    await fs.writeFile(contactsPath, contactsList, err => { if (err) console.error(err) })
    return filteredContacts
  } catch (error) {
    console.log(error.message)
  }
}

const addContact = async (body) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8')
    const contacts = JSON.parse(data)
    const newContact = { id: uuidv4(), ...body, }
    const updatedContacts = JSON.stringify([...contacts, newContact], null, 2)
    await fs.writeFile(contactsPath, updatedContacts, err => { if (err) console.error(err) })
    return newContact
  } catch (error) {
    console.log(error.message)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const updatedContacts = contacts.map(contact => {
      if (contact.id === Number(contactId)) {
        return { ...contact, ...body }
      } return contact
    })
    const contactsList = JSON.stringify(updatedContacts, null, 2)
    const updatedContact = updatedContacts.find(contact => contact.id === Number(contactId))
    await fs.writeFile(contactsPath, contactsList, err => { if (err) console.error(err) })
    return updatedContact
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
