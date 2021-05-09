const Joi = require('joi')
const schemaCreateContact = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required(),

  phone: Joi.string()
    .optional(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1)

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body)
    next()
  } catch (err) { next({ status: 400, message: `Field: ${err.message.replace(/"/g, '')}` }) }
}

module.exports.validateCreateContact = (req, _res, next) => { return validate(schemaCreateContact, req.body, next) }
module.exports.validateUpdateContact = (req, _res, next) => { return validate(schemaUpdateContact, req.body, next) }
