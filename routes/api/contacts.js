const express = require('express')
const router = express.Router()
const { listContacts, getContactById, addContact, } = require('../../model')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()
    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { contacts } })
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contactById = await getContactById(req.params.contactId)
    if (contactById) {
      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contactById } })
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not Found' })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const contact = await addContact(req.body)
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contact } })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
