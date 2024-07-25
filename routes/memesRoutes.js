const router = require('express').Router();
const { memesCtrl } = require('../controllers')

router.use(memesCtrl.getCurrentUserInfo)
router.get('/', memesCtrl.getMemes)
router.post('/', memesCtrl.createMeme)
router.put('/:id', memesCtrl.updateMeme)
router.delete('/:id', memesCtrl.deleteMeme)

module.exports = router