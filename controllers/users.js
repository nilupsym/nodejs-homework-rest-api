const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const { promisify } = require('util')

require('dotenv').config()
const Users = require('../model/users')
const { HttpCode } = require('../helpers/constants')
// const UploadAvatar = require('../services/upload-avatars-local')
const UploadAvatar = require('../services/upload-avatars-cloud')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
// const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

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
    const { id, email, subscription, avatar } = newUser
    return res.status(HttpCode.CREATED).json({
      status: '201 Created',
      data: {
        user: {
          id,
          email,
          subscription,
          avatar,
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
  return res.status(HttpCode.NO_CONTENT).json({
    status: '204 No Content',
    code: HttpCode.NO_CONTENT,
  })
}

const currentUser = async (req, res, next) => {
  try {
    const { email, subscription, id } = req.user
    const currentUser = await Users.findByEmail(email)
    if (currentUser) {
      return res.status(HttpCode.OK).json({
        status: '200 OK',
        id,
        email,
        subscription,
      })
    }
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: '401 Unauthorized',
      message: 'Not authorized',
    })
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const updatedUser = await Users.updateUser(userId, req.body)
    const { subscription } = updatedUser
    if (updatedUser) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, subscription, })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not Found' })
  } catch (error) {
    next(error)
  }
}

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    // const uploads = new UploadAvatar(AVATARS_OF_USERS)
    // const avatarUrl = await uploads.saveAvatarToStatic({
    //   idUser: id,
    //   pathFile: req.file.path,
    //   name: req.file.filename,
    //   oldFile: req.user.avatar,
    // })
    const uploadCloud = promisify(cloudinary.uploader.upload)
    const uploads = new UploadAvatar(uploadCloud)
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(req.file.path, req.user.userIdImg)
    await Users.updateAvatar(id, avatarUrl, userIdImg)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  update,
  avatars,
}
