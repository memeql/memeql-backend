const router = require('express').Router()
const { commentsCtrl } = require('../controllers')
const { authCtrl } = require('../controllers')

router.use(authCtrl.getCurrentUserInfo)
router.get('/getByMemeId/:memeId', commentsCtrl.getCommentsByMemeId)
router.post('/', commentsCtrl.createComment)
router.put('/:id', commentsCtrl.updateComment)
router.delete('/:id', commentsCtrl.deleteComment)

module.exports = router