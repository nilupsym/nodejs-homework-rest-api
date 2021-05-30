const express = require('express')
const router = express.Router()
// const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../model')
const { validateCreateContact, validateUpdateContact, validateFavoriteContact } = require('./validation')
const ctrl = require('../../controllers/contacts')

router.get('/', ctrl.getAll)

router.get('/:contactId', ctrl.getById)

router.post('/', validateCreateContact, ctrl.create)

router.delete('/:contactId', ctrl.remove)

router.put('/:contactId', validateUpdateContact, ctrl.update)

router.patch('/:contactId/favorite', validateFavoriteContact, ctrl.update)

module.exports = router
