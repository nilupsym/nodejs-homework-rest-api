const express = require('express')
const router = express.Router()
const ctrl = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const { validateSignup, validateUpdateSubscription } = require('./validation')
const upload = require('../../../helpers/upload')

router.get('/verify/:token', ctrl.verify)

router.post('/verify', ctrl.repeatSendEmailVerify)

router.post('/signup', validateSignup, ctrl.signup)

router.post('/login', ctrl.login)

router.post('/logout', guard, ctrl.logout)

router.get('/current', guard, ctrl.currentUser)

router.patch('/:userId/subscription', guard, validateUpdateSubscription, ctrl.update)

router.patch('/avatars', [guard, upload.single('avatar')], ctrl.avatars)

module.exports = router
