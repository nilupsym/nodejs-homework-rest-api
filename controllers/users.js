const jwt = require('jsonwebtoken')
require('dotenv').config()
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: '409 Conflict',
        message: 'Email in use',
      })
    }
    const newUser = await Users.create(req.body)
    const { email, subscription } = newUser
    return res.status(HttpCode.CREATED).json({
      status: '201 Created',
      data: {
        user: {
          email,
          subscription,
        },
      }
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const { subscription } = user
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: '401 Unauthorized',
        message: 'Email or password is wrong',
      })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1w' })
    await Users.updateToken(user.id, token)
    return res.status(HttpCode.OK).json({
      status: '200 OK',
      token,
      user: {
        email,
        subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

module.exports = {
  signup,
  login,
  logout,
}
