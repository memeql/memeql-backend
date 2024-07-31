const router = require("express").Router()
const { authCtrl } = require('../controllers')

router.get('/', authCtrl.returnCurrentUserInfo)
router.post('/', authCtrl.registerUser)
router.post('/login', authCtrl.loginUser)
router.post('/logout', authCtrl.logoutUser)
router.get('/userValidation/:userId', authCtrl.validateUser)

module.exports = router