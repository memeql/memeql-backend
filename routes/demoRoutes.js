const router = require('express').Router();
const { demoCtrl } = require('../controllers')
const {authCtrl} = require('../controllers')

router.use(authCtrl.getCurrentUserInfo)
router.get('/', demoCtrl.getDemo)

module.exports = router;