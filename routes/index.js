const router = require("express").Router()
const demoRoute = require("./demoRoutes.js")
const memesRoute = require("./memesRoutes.js")
const authRoute = require("./authRoutes.js")
const commentsRoute = require("./commentsRoutes.js")

router.use('/demo', demoRoute)
router.use('/memes', memesRoute)
router.use('/auth', authRoute)
router.use('/comments', commentsRoute)

module.exports = router