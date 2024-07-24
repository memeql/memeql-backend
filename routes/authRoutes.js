const router = require("express").Router()
const { authCtrl } = require('../controllers')

router.post('/', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)

module.exports = router