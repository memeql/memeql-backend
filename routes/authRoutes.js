const router = require("express").Router()
const { authCtrl } = require('../controllers')

router.post('/', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)
router.post('/userValidation/:userId', authCtrl.validateUser)

module.exports = router