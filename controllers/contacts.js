const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../model/contacts')
const { HttpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contacts, total, limit, offset } = await listContacts(userId, req.query)
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { total, limit, offset, contacts } })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contactById = await getContactById(userId, req.params.contactId)
    if (contactById) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contactById } })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not Found' })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await addContact({ ...req.body, owner: userId })
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const filteredContacts = await removeContact(userId, req.params.contactId)
    if (filteredContacts) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { filteredContacts } })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not Found' })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const updatedContact = await updateContact(userId, req.params.contactId, req.body)
    if (updatedContact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { updatedContact } })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not Found' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
}
