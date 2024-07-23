const router = require("express").Router()
const demoRoute = require("./demoRoutes.js")
const memesRoute = require("./memesRoutes.js")

router.use('/demo', demoRoute)
router.use('/memes', memesRoute)

module.exports = router