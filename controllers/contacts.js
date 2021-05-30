const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../model')
const { HttpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const contacts = await listContacts()
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contacts } })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const contactById = await getContactById(req.params.contactId)
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
    const contact = await addContact(req.body)
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const filteredContacts = await removeContact(req.params.contactId)
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
    const updatedContact = await updateContact(req.params.contactId, req.body)
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

// ;async (req, res, next) => {
//   try {
//     const contact = await updateContact(req.params.contactId, req.body)
//     if (contact) {
//       return res
//         .status(200)
//         .json({ status: 'success', code: 200, data: { contact } })
//     }
//     return res
//       .status(404)
//       .json({ status: 'error', code: 400, message: 'Missing field favorite' })
//   } catch (error) {
//     next(error)
//   }
// }

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
}
