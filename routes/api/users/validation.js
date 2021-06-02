const Joi = require('joi')
const schemaSignup = Joi.object({
  password: Joi.string()
    .min(6)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  subscription: Joi.string().optional(),
})

const schemaUpdateSubscription = Joi.object(
  {
    subscription: Joi.any().valid(...['starter', 'pro', 'business']),
  }
)

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body)
    next()
  } catch (err) {
    next({ status: 400, message: `Field: ${err.message.replace(/"/g, '')}` })
  }
}

module.exports.validateSignup = (req, _res, next) => {
  return validate(schemaSignup, req.body, next)
}

module.exports.validateUpdateSubscription = (req, _res, next) => {
  return validate(schemaUpdateSubscription, req.body, next)
}
