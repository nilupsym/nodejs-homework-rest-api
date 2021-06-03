const Contact = require('./schemas/contact')

const listContacts = async (userId, query) => {
  const {
    limit = 20,
    offset = 0,
    sortBy,
    sortByDesc,
    filter,
    favorite = null
  } = query
  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }
  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...((sortBy) ? { [`${sortBy}`]: 1 } : {}),
      ...((sortByDesc) ? { [`${sortByDesc}`]: -1 } : {})
    },
  })
  const { docs: contacts, totalDocs: total } = results
  return { contacts, total, limit, offset }
}

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  })
  return result
}

const removeContact = async (userId, contactId) => {
  const result = await Contact.findOneAndRemove({ _id: contactId, owner: userId })
  return result
}

const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
