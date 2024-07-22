const router = require('express').Router();
const { memesCtrl } = require('../controllers')

router.post('/', memesCtrl.createMeme)

module.exports = router