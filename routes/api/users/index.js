const express = require('express')
const router = express.Router()
const ctrl = require('../../../controllers/users')
const guard = require('../../../helpers/guard')

router.post('/signup', ctrl.signup)

router.post('/login', ctrl.login)

router.post('/logout', guard, ctrl.logout)

router.get('/current', guard, ctrl.currentUser)

module.exports = router
