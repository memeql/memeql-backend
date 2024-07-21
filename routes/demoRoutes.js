const router = require('express').Router();
const { demoCtrl } = require('../controllers')

router.get('/', demoCtrl.getDemo)

module.exports = router;